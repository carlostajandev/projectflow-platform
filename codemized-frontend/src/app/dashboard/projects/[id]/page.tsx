'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, X, MessageSquare } from 'lucide-react';
import { useTasks } from '@/hooks/useTasks';
import { useComments } from '@/hooks/useComments';
import { projectsService } from '@/lib/api/projects.service';
import { KanbanBoard } from '@/components/tasks/KanbanBoard';
import { CommentList } from '@/components/comments/CommentList';
import { CommentForm } from '@/components/comments/CommentForm';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import type { Project, Task } from '@/types';

export default function ProjectPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [project, setProject] = useState<Project | null>(null);
  const [projectLoading, setProjectLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const { tasks, loading: tasksLoading, createTask, updateTask, deleteTask } = useTasks(id);
  const { comments, loading: commentsLoading, addComment, deleteComment } = useComments(selectedTask?.id ?? null);

  useEffect(() => {
    projectsService.getById(id)
      .then(setProject)
      .finally(() => setProjectLoading(false));
  }, [id]);

  if (projectLoading) {
    return <div className="flex items-center justify-center py-24"><Spinner size="lg" /></div>;
  }

  if (!project) {
    return (
      <div className="text-center py-24">
        <p className="text-slate-400">Proyecto no encontrado</p>
        <Button variant="ghost" size="sm" onClick={() => router.push('/dashboard')} className="mt-3">
          Volver al dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.push('/dashboard')} className="!px-2">
          <ArrowLeft size={16} />
        </Button>
        <div>
          <h1 className="text-xl font-bold text-white">{project.name}</h1>
          {project.description && (
            <p className="text-sm text-slate-500 mt-0.5">{project.description}</p>
          )}
        </div>
      </div>

      {/* Kanban */}
      <KanbanBoard
        tasks={tasks}
        loading={tasksLoading}
        projectId={id}
        onTaskClick={setSelectedTask}
        onCreateTask={createTask}
        onDeleteTask={deleteTask}
      />

      {/* Task detail sidebar */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSelectedTask(null)} />
          <div className="relative w-full max-w-md bg-[#16161e] border-l border-white/10 h-full overflow-y-auto animate-slide-up flex flex-col">
            {/* Sidebar header */}
            <div className="sticky top-0 bg-[#16161e] border-b border-white/10 px-5 py-4 flex items-center justify-between">
              <h2 className="font-semibold text-white text-sm line-clamp-1">{selectedTask.title}</h2>
              <button onClick={() => setSelectedTask(null)} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors">
                <X size={16} />
              </button>
            </div>

            <div className="p-5 space-y-5 flex-1">
              {/* Description */}
              {selectedTask.description && (
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Descripción</p>
                  <p className="text-sm text-slate-300 leading-relaxed">{selectedTask.description}</p>
                </div>
              )}

              {/* Meta */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Estado', value: selectedTask.status },
                  { label: 'Prioridad', value: selectedTask.priority },
                  { label: 'Asignado', value: selectedTask.assignee?.name ?? 'Sin asignar' },
                  { label: 'Vence', value: selectedTask.dueDate ? new Date(selectedTask.dueDate).toLocaleDateString('es-ES') : 'Sin fecha' },
                ].map((item) => (
                  <div key={item.label} className="bg-white/5 rounded-lg px-3 py-2">
                    <p className="text-xs text-slate-500">{item.label}</p>
                    <p className="text-sm text-white font-medium mt-0.5">{item.value}</p>
                  </div>
                ))}
              </div>

              {/* Comments */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <MessageSquare size={14} className="text-slate-400" />
                  <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Comentarios {comments.length > 0 && `(${comments.length})`}
                  </p>
                </div>
                {commentsLoading ? (
                  <div className="flex justify-center py-4"><Spinner size="sm" /></div>
                ) : (
                  <CommentList comments={comments} onDelete={deleteComment} />
                )}
                <CommentForm onSubmit={(content) => addComment({ content }) as any} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}