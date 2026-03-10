'use client';
import Link from 'next/link';
import { Folder, Trash2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import type { Project } from '@/types';

interface ProjectCardProps {
  project: Project;
  onDelete: (id: string) => void;
}

export function ProjectCard({ project, onDelete }: ProjectCardProps) {
  return (
    <div className="group bg-white/5 hover:bg-white/[0.07] border border-white/10 hover:border-white/20 rounded-xl p-5 transition-all duration-200 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-brand-600/20 rounded-lg">
            <Folder size={18} className="text-brand-400" />
          </div>
          <h3 className="font-semibold text-white text-sm line-clamp-1">{project.name}</h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="opacity-0 group-hover:opacity-100 !p-1.5 text-red-400 hover:text-red-300 hover:bg-red-400/10"
          onClick={() => onDelete(project.id)}
        >
          <Trash2 size={14} />
        </Button>
      </div>

      {project.description && (
        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{project.description}</p>
      )}

      <div className="flex items-center justify-between pt-1 mt-auto">
        <span className="text-xs text-slate-600">
          {new Date(project.createdAt).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
        </span>
        <Link
          href={`/dashboard/projects/${project.id}`}
          className="flex items-center gap-1 text-xs text-brand-400 hover:text-brand-300 font-medium transition-colors"
        >
          Ver tablero <ArrowRight size={12} />
        </Link>
      </div>
    </div>
  );
}