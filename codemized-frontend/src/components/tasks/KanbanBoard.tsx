'use client';
import { useState } from 'react';
import { KanbanColumn } from './KanbanColumn';
import { CreateTaskModal } from './CreateTaskModal';
import { SkeletonList } from '@/components/ui/SkeletonCard';
import type { Task, TaskStatus, CreateTaskPayload } from '@/types';

const COLUMNS: TaskStatus[] = ['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE'];

interface KanbanBoardProps {
  tasks: Task[];
  loading: boolean;
  projectId: string;
  onTaskClick: (task: Task) => void;
  onCreateTask: (payload: CreateTaskPayload) => Promise<any>;
  onDeleteTask: (taskId: string) => void;
}

export function KanbanBoard({ tasks, loading, onTaskClick, onCreateTask, onDeleteTask }: KanbanBoardProps) {
  const [createModal, setCreateModal] = useState<{ open: boolean; defaultStatus: TaskStatus }>({
    open: false,
    defaultStatus: 'TODO',
  });

  const openCreate = (status: TaskStatus) => setCreateModal({ open: true, defaultStatus: status });
  const closeCreate = () => setCreateModal((prev) => ({ ...prev, open: false }));

  if (loading) {
    return (
      <div className="grid grid-cols-4 gap-4">
        {COLUMNS.map((col) => (
          <div key={col} className="space-y-3">
            <div className="h-6 w-24 bg-white/10 rounded animate-pulse" />
            <SkeletonList count={2} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {COLUMNS.map((status) => (
          <KanbanColumn
            key={status}
            status={status}
            tasks={tasks.filter((t) => t.status === status)}
            onTaskClick={onTaskClick}
            onTaskDelete={onDeleteTask}
            onAddTask={openCreate}
          />
        ))}
      </div>

      <CreateTaskModal
        open={createModal.open}
        defaultStatus={createModal.defaultStatus}
        onClose={closeCreate}
        onCreate={onCreateTask}
      />
    </>
  );
}
