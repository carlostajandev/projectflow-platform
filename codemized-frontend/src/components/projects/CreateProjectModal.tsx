'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { projectSchema, type ProjectFormValues } from '@/lib/validations/project.schema';
import type { CreateProjectPayload } from '@/types';

interface CreateProjectModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (payload: CreateProjectPayload) => Promise<any>;
}

export function CreateProjectModal({ open, onClose, onCreate }: CreateProjectModalProps) {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
  });

  const onSubmit = async (data: ProjectFormValues) => {
    await onCreate(data);
    reset();
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Nuevo proyecto" size="sm">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Nombre"
          placeholder="Mi proyecto increíble"
          error={errors.name?.message}
          {...register('name')}
        />
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Descripción</label>
          <textarea
            placeholder="Descripción opcional..."
            rows={3}
            className="w-full bg-white/5 border border-white/10 hover:border-white/20 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-500 resize-none focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500/50 transition-all"
            {...register('description')}
          />
          {errors.description && <p className="text-xs text-red-400">{errors.description.message}</p>}
        </div>
        <div className="flex gap-2 pt-1">
          <Button type="button" variant="secondary" onClick={onClose} className="flex-1">Cancelar</Button>
          <Button type="submit" loading={isSubmitting} className="flex-1">Crear</Button>
        </div>
      </form>
    </Modal>
  );
}
