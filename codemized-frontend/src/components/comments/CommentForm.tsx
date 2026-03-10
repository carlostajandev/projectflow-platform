'use client';
import { useState } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface CommentFormProps {
  onSubmit: (content: string) => Promise<void>;
}

export function CommentForm({ onSubmit }: CommentFormProps) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim()) return;
    try {
      setLoading(true);
      await onSubmit(content.trim());
      setContent('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-2 mt-3">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Escribí un comentario..."
        rows={2}
        onKeyDown={(e) => { if (e.key === 'Enter' && e.metaKey) handleSubmit(); }}
        className="flex-1 bg-white/5 border border-white/10 hover:border-white/20 rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-500 resize-none focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-all"
      />
      <Button size="sm" loading={loading} onClick={handleSubmit} className="self-end !px-3">
        <Send size={14} />
      </Button>
    </div>
  );
}