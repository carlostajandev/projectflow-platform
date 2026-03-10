'use client';
import { Trash2 } from 'lucide-react';
import { useAuthStore } from '@/lib/store/auth.store';
import type { Comment } from '@/types';

interface CommentListProps {
  comments: Comment[];
  onDelete: (commentId: string) => void;
}

export function CommentList({ comments, onDelete }: CommentListProps) {
  const currentUser = useAuthStore((s) => s.user);

  if (comments.length === 0) {
    return <p className="text-sm text-slate-600 py-4 text-center">Sin comentarios todavía.</p>;
  }

  return (
    <div className="space-y-3">
      {comments.map((comment) => (
        <div key={comment.id} className="group flex gap-3">
          <div className="w-7 h-7 rounded-full bg-brand-600/30 border border-brand-500/30 flex items-center justify-center text-xs font-bold text-brand-300 shrink-0 mt-0.5">
            {comment.author?.name?.[0]?.toUpperCase() ?? '?'}
          </div>
          <div className="flex-1 bg-white/5 rounded-xl px-3 py-2.5 space-y-1">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-slate-300">{comment.author?.name ?? 'Usuario'}</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-600">
                  {new Date(comment.createdAt).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}
                </span>
                {currentUser?.id === comment.authorId && (
                  <button
                    onClick={() => onDelete(comment.id)}
                    className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400 transition-all"
                  >
                    <Trash2 size={12} />
                  </button>
                )}
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">{comment.content}</p>
          </div>
        </div>
      ))}
    </div>
  );
}