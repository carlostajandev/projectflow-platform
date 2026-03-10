import apiClient from './client';
import type { ApiResponse, Project, CreateProjectPayload, UpdateProjectPayload } from '@/types';

export const projectsService = {
  async getAll(): Promise<Project[]> {
    const res = await apiClient.get<ApiResponse<Project[]>>('/projects');
    return res.data.data;
  },

  async getById(id: string): Promise<Project> {
    const res = await apiClient.get<ApiResponse<Project>>(`/projects/${id}`);
    return res.data.data;
  },

  async create(payload: CreateProjectPayload): Promise<Project> {
    const res = await apiClient.post<ApiResponse<Project>>('/projects', payload);
    return res.data.data;
  },

  async update(id: string, payload: UpdateProjectPayload): Promise<Project> {
    const res = await apiClient.put<ApiResponse<Project>>(`/projects/${id}`, payload);
    return res.data.data;
  },

  async remove(id: string): Promise<void> {
    await apiClient.delete(`/projects/${id}`);
  },
};