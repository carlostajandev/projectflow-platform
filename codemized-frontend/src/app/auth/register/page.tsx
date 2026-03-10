import { RegisterForm } from '@/components/auth/RegisterForm';

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-[#0f0f13] flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-brand-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-sm animate-slide-up">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-brand-600 mb-4 shadow-lg shadow-brand-900/50">
            <span className="text-xl">⚡</span>
          </div>
          <h1 className="text-2xl font-bold text-white">ProjectFlow</h1>
          <p className="text-sm text-slate-500 mt-1">Creá tu cuenta gratis</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
          <RegisterForm />
        </div>
      </div>
    </main>
  );
}