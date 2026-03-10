import apiClient from './client';
import type { ApiResponse, Task, CreateTaskPayload, UpdateTaskPayload } from '@/types';

export const tasksService = {
  async getByProject(projectId: string): Promise<Task[]> {
    const res = await apiClient.get<ApiResponse<Task[]>>(`/projects/${projectId}/tasks`);
    return res.data.data;
  },

  async create(projectId: string, payload: CreateTaskPayload): Promise<Task> {
    const res = await apiClient.post<ApiResponse<Task>>(`/projects/${projectId}/tasks`, payload);
    return res.data.data;
  },

  async update(projectId: string, taskId: string, payload: UpdateTaskPayload): Promise<Task> {
    const res = await apiClient.put<ApiResponse<Task>>(`/projects/${projectId}/tasks/${taskId}`, payload);
    return res.data.data;
  },

  async assign(projectId: string, taskId: string, assigneeId: string | null): Promise<Task> {
    const res = await apiClient.patch<ApiResponse<Task>>(`/projects/${projectId}/tasks/${taskId}/assign`, { assigneeId });
    return res.data.data;
  },

  async remove(projectId: string, taskId: string): Promise<void> {
    await apiClient.delete(`/projects/${projectId}/tasks/${taskId}`);
  },
};