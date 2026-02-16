'use client'

import { useActionState } from 'react'
import { forgotPassword } from './actions'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { Alert, AlertDescription } from '@repo/ui/components/ui/alert'
import { AlertCircle, CheckCircle2 } from 'lucide-react'

const initialState = {
    error: '',
    success: '',
}

export default function ForgotPasswordPage() {
    const t = useTranslations('Auth');
    const [state, action, isPending] = useActionState(async (state: any, payload: FormData) => {
        const result = await forgotPassword(payload);
        if (result?.error) return { error: result.error, success: '' };
        if (result?.success) return { error: '', success: result.success };
        return { error: '', success: '' };
    }, initialState)

    return (
        <div className="mx-auto grid gap-6">
            <div className="grid gap-2 text-center">
                <h1 className="text-3xl font-bold">{t('forgotPassword')}</h1>
                <p className="text-muted-foreground">
                    Enter your email to reset your password
                </p>
            </div>
            <form action={action} className="grid gap-4">
                <div className="grid gap-2">
                    <label htmlFor="email">{t('email')}</label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="m@example.com"
                        required
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                </div>

                {state?.error && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{state.error}</AlertDescription>
                    </Alert>
                )}
                {state?.success && (
                    <Alert className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
                        <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                        <AlertDescription className="text-green-800 dark:text-green-300">
                            {state.success}
                        </AlertDescription>
                    </Alert>
                )}

                <button type="submit" disabled={isPending} className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full">
                    {isPending ? `${t('sendResetLink')}...` : t('sendResetLink')}
                </button>
            </form>
            <div className="text-center text-sm">
                {t('rememberPassword')}{" "}
                <Link href="/login" className="underline text-primary">
                    {t('logIn')}
                </Link>
            </div>
        </div>
    )
}
