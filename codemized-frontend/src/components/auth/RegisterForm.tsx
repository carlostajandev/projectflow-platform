'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authService } from '@/lib/api/auth.service';
import { useAuthStore } from '@/lib/store/auth.store';
import { registerSchema, type RegisterFormValues } from '@/lib/validations/auth.schema';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export function RegisterForm() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [serverError, setServerError] = useState('');

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      setServerError('');
      const { accessToken, user } = await authService.register({
        name: data.name,
        email: data.email,
        password: data.password,
      });
      setAuth(user, accessToken);
      router.push('/dashboard');
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        'Error al registrarse';
      setServerError(Array.isArray(msg) ? msg.join(', ') : msg);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input label="Nombre completo" type="text" placeholder="Carlos García" error={errors.name?.message} {...register('name')} />
      <Input label="Email" type="email" placeholder="tu@email.com" error={errors.email?.message} {...register('email')} />
      <Input label="Contraseña" type="password" placeholder="••••••••" error={errors.password?.message} {...register('password')} />
      <Input label="Confirmar contraseña" type="password" placeholder="••••••••" error={errors.confirmPassword?.message} {...register('confirmPassword')} />

      {serverError && (
        <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
          {serverError}
        </p>
      )}

      <Button type="submit" size="lg" loading={isSubmitting} className="w-full mt-2">
        Crear cuenta
      </Button>

      <p className="text-center text-sm text-slate-500">
        ¿Ya tenés cuenta?{' '}
        <Link href="/auth/login" className="text-brand-400 hover:text-brand-300 transition-colors">
          Iniciá sesión
        </Link>
      </p>
    </form>
  );
}
