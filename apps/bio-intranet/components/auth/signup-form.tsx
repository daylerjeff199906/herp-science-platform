'use client';

import { useActionState, useState } from 'react';
import { signup } from '@/app/[locale]/(auth)/signup/actions';
import { PasswordStrength } from '@/components/auth/password-strength';
import { PasswordInput } from '@/components/auth/password-input';
import { useTranslations } from 'next-intl';
import { Alert, AlertDescription } from '@repo/ui/components/ui/alert';
import { AlertCircle } from 'lucide-react';

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
            {(state?.errors as any)?.firstName && <p className="text-destructive text-sm">{(state?.errors as any).firstName}</p>}
            {(state?.errors as any)?.lastName && <p className="text-destructive text-sm">{(state?.errors as any).lastName}</p>}

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
            {(state?.errors as any)?.email && <p className="text-destructive text-sm">{(state?.errors as any).email}</p>}

            <div className="grid gap-2">
                <label htmlFor="password" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">{t('password')}</label>
                <PasswordInput id="password" name="password" required onChange={handlePasswordChange} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pr-10" />
                <PasswordStrength checks={checks} />
            </div>
            {(state?.errors as any)?.password && <p className="text-destructive text-sm">{(state?.errors as any).password}</p>}

            <div className="grid gap-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">{t('confirmPassword')}</label>
                <PasswordInput id="confirmPassword" name="confirmPassword" required onChange={(e) => setConfirmPassword(e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pr-10" />
            </div>
            {(state?.errors as any)?.confirmPassword && <p className="text-destructive text-sm">{(state?.errors as any).confirmPassword}</p>}

            <button type="submit" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full" disabled={isPending}>
                Create an account
            </button>
            {state?.message && <p className="text-destructive text-sm">{state.message}</p>}
        </form>
    );
}
