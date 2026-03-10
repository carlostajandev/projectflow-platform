'use client';
import { useState, useEffect, useCallback } from 'react';
import { commentsService } from '@/lib/api/comments.service';
import type { Comment, CreateCommentPayload } from '@/types';

export function useComments(taskId: string | null) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState<string | null>(null);

  const fetchComments = useCallback(async () => {
    if (!taskId) return;
    try {
      setLoading(true);
      setError(null);
      const data = await commentsService.getByTask(taskId);
      setComments(data);
    } catch {
      setError('Error al cargar los comentarios');
    } finally {
      setLoading(false);
    }
  }, [taskId]);

  useEffect(() => { fetchComments(); }, [fetchComments]);

  const addComment = async (payload: CreateCommentPayload) => {
    if (!taskId) return;
    const comment = await commentsService.create(taskId, payload);
    setComments((prev) => [...prev, comment]);
    return comment;
  };

  const deleteComment = async (commentId: string) => {
    if (!taskId) return;
    await commentsService.remove(taskId, commentId);
    setComments((prev) => prev.filter((c) => c.id !== commentId));
  };

  return { comments, loading, error, refetch: fetchComments, addComment, deleteComment };
}