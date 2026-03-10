'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { taskSchema, type TaskFormValues } from '@/lib/validations/task.schema';
import type { CreateTaskPayload, TaskStatus } from '@/types';

interface CreateTaskModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (payload: CreateTaskPayload) => Promise<void>;
  defaultStatus?: TaskStatus;
}

export function CreateTaskModal({ open, onClose, onCreate, defaultStatus = 'TODO' }: CreateTaskModalProps) {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: { status: defaultStatus, priority: 'MEDIUM' },
  });

  const onSubmit = async (data: TaskFormValues) => {
    await onCreate({ ...data, assigneeId: data.assigneeId || undefined });
    reset();
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Nueva tarea" size="md">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Título"
          placeholder="Descripción breve de la tarea"
          error={errors.title?.message}
          {...register('title')}
        />
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Descripción</label>
          <textarea
            placeholder="Detalles opcionales..."
            rows={3}
            className="w-full bg-white/5 border border-white/10 hover:border-white/20 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-500 resize-none focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-all"
            {...register('description')}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Estado</label>
            <select
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-all"
              {...register('status')}
            >
              <option value="TODO">Por hacer</option>
              <option value="IN_PROGRESS">En progreso</option>
              <option value="IN_REVIEW">En revisión</option>
              <option value="DONE">Completado</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Prioridad</label>
            <select
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-all"
              {...register('priority')}
            >
              <option value="LOW">Baja</option>
              <option value="MEDIUM">Media</option>
              <option value="HIGH">Alta</option>
              <option value="CRITICAL">Crítica</option>
            </select>
          </div>
        </div>
        <Input
          label="Fecha límite"
          type="date"
          error={errors.dueDate?.message}
          {...register('dueDate')}
        />
        <div className="flex gap-2 pt-1">
          <Button type="button" variant="secondary" onClick={onClose} className="flex-1">Cancelar</Button>
          <Button type="submit" loading={isSubmitting} className="flex-1">Crear tarea</Button>
        </div>
      </form>
    </Modal>
  );
}