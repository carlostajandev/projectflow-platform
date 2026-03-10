'use client';
import { Plus } from 'lucide-react';
import { ProjectCard } from './ProjectCard';
import { SkeletonList } from '@/components/ui/SkeletonCard';
import { Button } from '@/components/ui/Button';
import type { Project } from '@/types';

interface ProjectListProps {
  projects: Project[];
  loading: boolean;
  onDelete: (id: string) => void;
  onCreateClick: () => void;
}

export function ProjectList({ projects, loading, onDelete, onCreateClick }: ProjectListProps) {
  if (loading) return <SkeletonList count={6} />;

  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
          <span className="text-3xl">📁</span>
        </div>
        <div className="text-center">
          <p className="text-white font-medium">Sin proyectos todavía</p>
          <p className="text-sm text-slate-500 mt-1">Creá tu primer proyecto para empezar</p>
        </div>
        <Button onClick={onCreateClick} size="sm">
          <Plus size={14} /> Nuevo proyecto
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} onDelete={onDelete} />
      ))}
    </div>
  );
}