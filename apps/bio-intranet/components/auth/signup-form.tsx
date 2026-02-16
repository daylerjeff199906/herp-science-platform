'use client';

import { useActionState, useState } from 'react';
import { signup } from '@/app/[locale]/(auth)/signup/actions';
import { PasswordStrength } from '@/components/auth/password-strength';
import { PasswordInput } from '@/components/auth/password-input';
import { useTranslations } from 'next-intl';
import { Alert, AlertDescription } from '@repo/ui/components/ui/alert';
import { AlertCircle, CheckCircle2, Mail } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@repo/ui/components/ui/button';

export default function SignupForm() {
    const t = useTranslations('Auth');
    const [state, formAction, isPending] = useActionState(signup, null);
    const [, setPassword] = useState('');
    const [, setConfirmPassword] = useState('');
    const [checks, setChecks] = useState({
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        special: false,
    });

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setPassword(val);
        setChecks({
            length: val.length >= 8,
            uppercase: /[A-Z]/.test(val),
            lowercase: /[a-z]/.test(val),
            number: /[0-9]/.test(val),
            special: /[^A-Za-z0-9]/.test(val),
        });
    };

    // Si el registro fue exitoso, mostrar mensaje de éxito
    if (state?.success) {
        return (
            <div className="flex flex-col items-center justify-center text-center space-y-6 py-8">
                <div className="relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-24 h-24 bg-green-500/20 rounded-full animate-pulse" />
                    </div>
                    <div className="relative flex items-center justify-center w-24 h-24 bg-green-500/10 rounded-full border-4 border-green-500/20">
                        <CheckCircle2 className="w-12 h-12 text-green-600 dark:text-green-400" />
                    </div>
                </div>

                <div className="space-y-2 max-w-md">
                    <h2 className="text-2xl font-bold text-foreground">
                        {t('accountCreated') || '¡Cuenta Creada!'}
                    </h2>
                    <div className="flex items-center justify-center gap-2 text-muted-foreground">
                        <Mail className="w-5 h-5" />
                        <p className="text-sm">
                            {t('checkEmailConfirm') || 'Por favor revisa tu correo electrónico para confirmar tu cuenta.'}
                        </p>
                    </div>
                </div>

                <Alert className="max-w-md bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
                    <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <AlertDescription className="text-blue-800 dark:text-blue-300">
                        {t('emailSentNote') || 'Te hemos enviado un enlace de confirmación. Revisa tu bandeja de entrada y spam.'}
                    </AlertDescription>
                </Alert>

                <Button asChild className="w-full max-w-md">
                    <Link href="/login">
                        {t('goToLogin') || 'Ir al Login'}
                    </Link>
                </Button>
            </div>
        );
    }

    return (
        <form action={formAction} className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                    <label htmlFor="firstName" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">{t('firstName')}</label>
                    <input id="firstName" name="firstName" placeholder="Max" required className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
                </div>
                <div className="grid gap-2">
                    <label htmlFor="lastName" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">{t('lastName')}</label>
                    <input id="lastName" name="lastName" placeholder="Robinson" required className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
                </div>
            </div>
            {(state?.errors as any)?.firstName && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{(state?.errors as any).firstName}</AlertDescription>
                </Alert>
            )}
            {(state?.errors as any)?.lastName && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{(state?.errors as any).lastName}</AlertDescription>
                </Alert>
            )}

            <div className="grid gap-2">
                <label htmlFor="email" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">{t('email')}</label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
            </div>
            {(state?.errors as any)?.email && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{(state?.errors as any).email}</AlertDescription>
                </Alert>
            )}

            <div className="grid gap-2">
                <label htmlFor="password" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">{t('password')}</label>
                <PasswordInput id="password" name="password" required onChange={handlePasswordChange} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pr-10" />
                <PasswordStrength checks={checks} />
            </div>
            {(state?.errors as any)?.password && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{(state?.errors as any).password}</AlertDescription>
                </Alert>
            )}

            <div className="grid gap-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">{t('confirmPassword')}</label>
                <PasswordInput id="confirmPassword" name="confirmPassword" required onChange={(e) => setConfirmPassword(e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pr-10" />
            </div>
            {(state?.errors as any)?.confirmPassword && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{(state?.errors as any).confirmPassword}</AlertDescription>
                </Alert>
            )}

            {state?.message && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{state.message}</AlertDescription>
                </Alert>
            )}

            <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? `${t('createAccount')}...` : t('createAccount')}
            </Button>
        </form>
    );
}
