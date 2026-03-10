import apiClient from "./client";
import type {
  ApiResponse,
  Task,
  CreateTaskPayload,
  UpdateTaskPayload,
} from "@/types";

interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export const tasksService = {
  async getByProject(
    projectId: string,
    page = 1,
    limit = 100,
  ): Promise<Task[]> {
    const res = await apiClient.get<ApiResponse<PaginatedResponse<Task>>>(
      `/projects/${projectId}/tasks`,
      { params: { page, limit } },
    );

    // Defensive: handle both paginated { data: [], meta: {} } and plain array responses
    const payload = res.data.data;
    if (Array.isArray(payload)) return payload;
    if (payload && Array.isArray((payload as any).data))
      return (payload as any).data;
    return [];
  },

  async create(projectId: string, payload: CreateTaskPayload): Promise<Task> {
    const res = await apiClient.post<ApiResponse<Task>>(
      `/projects/${projectId}/tasks`,
      payload,
    );
    return res.data.data;
  },

  async update(
    projectId: string,
    taskId: string,
    payload: UpdateTaskPayload,
  ): Promise<Task> {
    const res = await apiClient.put<ApiResponse<Task>>(
      `/projects/${projectId}/tasks/${taskId}`,
      payload,
    );
    return res.data.data;
  },

  async assign(
    projectId: string,
    taskId: string,
    assigneeId: string | null,
  ): Promise<Task> {
    const res = await apiClient.patch<ApiResponse<Task>>(
      `/projects/${projectId}/tasks/${taskId}/assign`,
      { assigneeId },
    );
    return res.data.data;
  },

  async remove(projectId: string, taskId: string): Promise<void> {
    await apiClient.delete(`/projects/${projectId}/tasks/${taskId}`);
  },
};
