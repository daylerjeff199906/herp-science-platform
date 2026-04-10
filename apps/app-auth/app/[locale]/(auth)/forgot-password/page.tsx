'use client'

import * as React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { resetPassword } from '../login/actions'
import { Alert, AlertDescription } from '@repo/ui/components/ui/alert'
import { Button } from '@repo/ui/components/ui/button'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from '@repo/ui/components/ui/form'
import { Input } from '@repo/ui/components/ui/input'
import { Loader2, CheckCircle2 } from 'lucide-react'

const schema = z.object({
    email: z.string().email(),
})

type Values = z.infer<typeof schema>

export default function ForgotPasswordPage() {
    const t = useTranslations('Auth')
    const locale = useLocale()
    const [error, setError] = React.useState<string>('')
    const [success, setSuccess] = React.useState(false)
    const [isPending, setIsPending] = React.useState(false)

    const form = useForm<Values>({
        resolver: zodResolver(schema),
        defaultValues: { email: '' },
    })

    const onSubmit = async (data: Values) => {
        setIsPending(true)
        setError('')
        const formData = new FormData()
        formData.append('email', data.email)

        try {
            const result = await resetPassword(formData, locale)
            if (result?.error) {
                setError(result.error)
            } else {
                setSuccess(true)
            }
        } catch (err) {
            setError('An unexpected error occurred')
        } finally {
            setIsPending(false)
        }
    }

    if (success) {
        return (
            <div className="mx-auto flex flex-col items-center justify-center space-y-4 text-center">
                <CheckCircle2 className="h-12 w-12 text-primary" />
                <h1 className="text-2xl font-bold">Enlace enviado</h1>
                <p className="text-muted-foreground text-sm">
                    Si existe una cuenta asociada a este correo, hemos enviado instrucciones para restablecer tu contraseña.
                </p>
                <Button asChild className="mt-4">
                    <Link href={`/${locale}/login`}>Volver al inicio</Link>
                </Button>
            </div>
        )
    }

    return (
        <div className="mx-auto grid gap-6 w-full max-w-sm">
            <div className="grid gap-2 text-center">
                <h1 className="text-2xl font-bold">{t('forgotPassword')}</h1>
                <p className="text-muted-foreground text-sm">
                    Ingresa tu correo para recibir un enlace de recuperación
                </p>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
                    {error && (
                        <Alert variant="destructive">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input
                                        placeholder={t('emailPlaceholder')}
                                        type="email"
                                        disabled={isPending}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type="submit" className="w-full" disabled={isPending}>
                        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {t('sendResetLink')}
                    </Button>
                </form>
            </Form>

            <div className="text-center text-sm">
                <Link href={`/${locale}/login`} className="underline text-primary">
                    {t('signIn')}
                </Link>
            </div>
        </div>
    )
}
