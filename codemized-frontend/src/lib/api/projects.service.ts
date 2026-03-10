import apiClient from './client';
import type { ApiResponse, Project, CreateProjectPayload, UpdateProjectPayload } from '@/types';

interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total:       number;
    page:        number;
    limit:       number;
    totalPages:  number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export const projectsService = {
  async getAll(page = 1, limit = 50): Promise<Project[]> {
    const res = await apiClient.get<ApiResponse<PaginatedResponse<Project>>>(
      '/projects',
      { params: { page, limit } },
    );

    // Defensive: handle both paginated { data: [], meta: {} } and plain array responses
    const payload = res.data.data;
    if (Array.isArray(payload)) return payload;
    if (payload && Array.isArray((payload as any).data)) return (payload as any).data;
    return [];
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
