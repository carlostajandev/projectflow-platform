'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LogOut, LayoutDashboard } from 'lucide-react';
import { useAuthStore } from '@/lib/store/auth.store';
import { Button } from '@/components/ui/Button';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) router.replace('/auth/login');
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  return (
    <div className="min-h-screen bg-[#0f0f13] flex flex-col">
      {/* Navbar */}
      <header className="sticky top-0 z-40 border-b border-white/8 bg-[#0f0f13]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center">
              <span className="text-sm">⚡</span>
            </div>
            <span className="font-bold text-white text-sm">ProjectFlow</span>
          </Link>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
              <div className="w-5 h-5 rounded-full bg-brand-600/40 border border-brand-500/40 flex items-center justify-center text-xs font-bold text-brand-300">
                {user?.name?.[0]?.toUpperCase()}
              </div>
              <span className="text-xs text-slate-300">{user?.name}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="!px-2">
              <LogOut size={14} />
              <span className="hidden sm:inline">Salir</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-8">
        {children}
      </main>
    </div>
  );
}