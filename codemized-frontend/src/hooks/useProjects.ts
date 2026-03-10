'use client';
import { useState, useEffect, useCallback } from 'react';
import { projectsService } from '@/lib/api/projects.service';
import type { Project, CreateProjectPayload, UpdateProjectPayload } from '@/types';

export function useProjects() {
  const [projects, setProjects]   = useState<Project[]>([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await projectsService.getAll();
      setProjects(data);
    } catch {
      setError('Error al cargar los proyectos');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProjects(); }, [fetchProjects]);

  const createProject = async (payload: CreateProjectPayload) => {
    const project = await projectsService.create(payload);
    setProjects((prev) => [project, ...prev]);
    return project;
  };

  const updateProject = async (id: string, payload: UpdateProjectPayload) => {
    const updated = await projectsService.update(id, payload);
    setProjects((prev) => prev.map((p) => (p.id === id ? updated : p)));
    return updated;
  };

  const deleteProject = async (id: string) => {
    await projectsService.remove(id);
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  return { projects, loading, error, refetch: fetchProjects, createProject, updateProject, deleteProject };
}