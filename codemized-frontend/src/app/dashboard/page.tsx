'use client';
import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useProjects } from '@/hooks/useProjects';
import { ProjectList } from '@/components/projects/ProjectList';
import { CreateProjectModal } from '@/components/projects/CreateProjectModal';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/lib/store/auth.store';

export default function DashboardPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const { projects, loading, createProject, deleteProject } = useProjects();
  const user = useAuthStore((s) => s.user);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">
            Hola, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {projects.length > 0
              ? `Tenés ${projects.length} proyecto${projects.length !== 1 ? 's' : ''} activo${projects.length !== 1 ? 's' : ''}`
              : 'Empezá creando tu primer proyecto'}
          </p>
        </div>
        <Button onClick={() => setModalOpen(true)} size="sm">
          <Plus size={14} /> Nuevo proyecto
        </Button>
      </div>

      {projects.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Proyectos', value: projects.length },
            { label: 'Esta semana', value: projects.filter(p => {
              const diff = (Date.now() - new Date(p.createdAt).getTime()) / (1000 * 60 * 60 * 24);
              return diff <= 7;
            }).length },
            { label: 'Activos', value: projects.length },
          ].map((stat) => (
            <div key={stat.label} className="bg-white/5 border border-white/10 rounded-xl px-4 py-3">
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-xs text-slate-500 mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>
      )}

      <ProjectList
        projects={projects}
        loading={loading}
        onDelete={deleteProject}
        onCreateClick={() => setModalOpen(true)}
      />

      <CreateProjectModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreate={createProject}
      />
    </div>
  );
}
