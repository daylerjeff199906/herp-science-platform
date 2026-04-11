'use client'

import { useActionState, use } from 'react'
import { resetPassword } from './actions'
import { PasswordInput } from '@/components/auth/password-input'
import { useTranslations } from 'next-intl'
import { Alert, AlertDescription } from '@repo/ui/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import { Button } from '@repo/ui/components/ui/button'

const initialState = {
    error: '',
}

export default function ResetPasswordPage() {
    const t = useTranslations('Auth');
    const [state, action, isPending] = useActionState(async (state: any, payload: FormData) => {
        const result = await resetPassword(payload);
        if (result?.error) return { error: result.error };
        return { error: '' };
    }, initialState)

    return (
        <div className="mx-auto grid gap-6 w-full max-w-sm">
            <div className="grid gap-2 text-center">
                <h1 className="text-3xl font-bold">{t('resetPassword')}</h1>
                <p className="text-muted-foreground text-sm">
                    Ingresa tu nueva contraseña a continuación.
                </p>
            </div>
            <form action={action} className="grid gap-4">
                <div className="grid gap-2">
                    <PasswordInput
                        id="password"
                        name="password"
                        placeholder={t('passwordPlaceholder')}
                        required
                        disabled={isPending}
                    />
                </div>

                {state?.error && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{state.error}</AlertDescription>
                    </Alert>
                )}

                <Button type="submit" disabled={isPending} className="w-full">
                    {isPending ? `${t('updatePassword')}...` : t('updatePassword')}
                </Button>
            </form>
        </div>
    )
}
