'use client';
import { Plus } from 'lucide-react';
import { TaskCard } from './TaskCard';
import { clsx } from 'clsx';
import type { Task, TaskStatus } from '@/types';

const columnConfig: Record<TaskStatus, { label: string; accent: string; dot: string }> = {
  TODO:        { label: 'Por hacer',   accent: 'border-slate-600/40',  dot: 'bg-slate-500' },
  IN_PROGRESS: { label: 'En progreso', accent: 'border-blue-500/40',   dot: 'bg-blue-400' },
  IN_REVIEW:   { label: 'En revisión', accent: 'border-yellow-500/40', dot: 'bg-yellow-400' },
  DONE:        { label: 'Completado',  accent: 'border-green-500/40',  dot: 'bg-green-400' },
};

interface KanbanColumnProps {
  status: TaskStatus;
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onTaskDelete: (taskId: string) => void;
  onAddTask: (status: TaskStatus) => void;
}

export function KanbanColumn({ status, tasks, onTaskClick, onTaskDelete, onAddTask }: KanbanColumnProps) {
  const config = columnConfig[status];

  return (
    <div className={clsx('flex flex-col gap-3 bg-white/[0.03] border rounded-2xl p-4 min-h-[400px]', config.accent)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={clsx('w-2 h-2 rounded-full', config.dot)} />
          <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">{config.label}</span>
          <span className="text-xs text-slate-600 bg-white/5 px-1.5 py-0.5 rounded-full">{tasks.length}</span>
        </div>
        <button
          onClick={() => onAddTask(status)}
          className="p-1 rounded-lg text-slate-500 hover:text-white hover:bg-white/10 transition-colors"
        >
          <Plus size={14} />
        </button>
      </div>

      {/* Tasks */}
      <div className="flex flex-col gap-2 flex-1">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} onClick={onTaskClick} onDelete={onTaskDelete} />
        ))}
      </div>
    </div>
  );
}