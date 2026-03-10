'use client';
import { clsx } from 'clsx';
import { Trash2, User, Flag } from 'lucide-react';
import type { Task } from '@/types';

const priorityConfig = {
  LOW:      { label: 'Baja',     color: 'text-slate-400 bg-slate-400/10' },
  MEDIUM:   { label: 'Media',    color: 'text-yellow-400 bg-yellow-400/10' },
  HIGH:     { label: 'Alta',     color: 'text-orange-400 bg-orange-400/10' },
  CRITICAL: { label: 'Crítica',  color: 'text-red-400 bg-red-400/10' },
};

interface TaskCardProps {
  task: Task;
  onClick: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

export function TaskCard({ task, onClick, onDelete }: TaskCardProps) {
  const priority = priorityConfig[task.priority];

  return (
    <div
      className="group bg-[#1a1a24] hover:bg-[#1e1e2a] border border-white/8 hover:border-white/15 rounded-xl p-3.5 cursor-pointer transition-all duration-150 space-y-2.5"
      onClick={() => onClick(task)}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm text-white font-medium leading-snug line-clamp-2">{task.title}</p>
        <button
          className="opacity-0 group-hover:opacity-100 p-1 rounded text-slate-500 hover:text-red-400 hover:bg-red-400/10 transition-all shrink-0"
          onClick={(e) => { e.stopPropagation(); onDelete(task.id); }}
        >
          <Trash2 size={12} />
        </button>
      </div>

      {task.description && (
        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{task.description}</p>
      )}

      <div className="flex items-center justify-between pt-0.5">
        <span className={clsx('text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1', priority.color)}>
          <Flag size={10} />
          {priority.label}
        </span>
        {task.assignee && (
          <span className="flex items-center gap-1 text-xs text-slate-500">
            <User size={10} />
            {task.assignee.name.split(' ')[0]}
          </span>
        )}
      </div>
    </div>
  );
}