'use client';
import { useState, useEffect, useCallback } from 'react';
import { tasksService } from '@/lib/api/tasks.service';
import type { Task, CreateTaskPayload, UpdateTaskPayload } from '@/types';

export function useTasks(projectId: string) {
  const [tasks, setTasks]     = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    if (!projectId) return;
    try {
      setLoading(true);
      setError(null);
      const data = await tasksService.getByProject(projectId);
      setTasks(data);
    } catch {
      setError('Error al cargar las tareas');
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  const createTask = async (payload: CreateTaskPayload) => {
    const task = await tasksService.create(projectId, payload);
    setTasks((prev) => [task, ...prev]);
    return task;
  };

  const updateTask = async (taskId: string, payload: UpdateTaskPayload) => {
    const updated = await tasksService.update(projectId, taskId, payload);
    setTasks((prev) => prev.map((t) => (t.id === taskId ? updated : t)));
    return updated;
  };

  const deleteTask = async (taskId: string) => {
    await tasksService.remove(projectId, taskId);
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  return { tasks, loading, error, refetch: fetchTasks, createTask, updateTask, deleteTask };
}