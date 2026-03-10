import apiClient from './client';
import type { ApiResponse, Comment, CreateCommentPayload } from '@/types';

export const commentsService = {
  async getByTask(taskId: string): Promise<Comment[]> {
    const res = await apiClient.get<ApiResponse<Comment[]>>(`/tasks/${taskId}/comments`);
    return res.data.data;
  },

  async create(taskId: string, payload: CreateCommentPayload): Promise<Comment> {
    const res = await apiClient.post<ApiResponse<Comment>>(`/tasks/${taskId}/comments`, payload);
    return res.data.data;
  },

  async remove(taskId: string, commentId: string): Promise<void> {
    await apiClient.delete(`/tasks/${taskId}/comments/${commentId}`);
  },
};