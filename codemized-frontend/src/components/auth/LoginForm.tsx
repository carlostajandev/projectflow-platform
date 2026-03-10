'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authService } from '@/lib/api/auth.service';
import { useAuthStore } from '@/lib/store/auth.store';
import { loginSchema, type LoginFormValues } from '@/lib/validations/auth.schema';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export function LoginForm() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [serverError, setServerError] = useState('');

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      setServerError('');
      const { accessToken, user } = await authService.login(data);
      setAuth(user, accessToken);
      router.push('/dashboard');
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        'Credenciales incorrectas';
      setServerError(Array.isArray(msg) ? msg.join(', ') : msg);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input label="Email" type="email" placeholder="tu@email.com" error={errors.email?.message} {...register('email')} />
      <Input label="Contraseña" type="password" placeholder="••••••••" error={errors.password?.message} {...register('password')} />

      {serverError && (
        <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
          {serverError}
        </p>
      )}

      <Button type="submit" size="lg" loading={isSubmitting} className="w-full mt-2">
        Iniciar sesión
      </Button>

      <p className="text-center text-sm text-slate-500">
        ¿No tenés cuenta?{' '}
        <Link href="/auth/register" className="text-brand-400 hover:text-brand-300 transition-colors">
          Registrate
        </Link>
      </p>
    </form>
  );
}
