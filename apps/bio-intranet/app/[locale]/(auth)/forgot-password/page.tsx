'use client'

import * as React from 'react'
import { useForm, type ControllerRenderProps } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { forgotPassword } from './actions'
import { Alert, AlertDescription } from '@repo/ui/components/ui/alert'
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react'
import { Button } from '@repo/ui/components/ui/button'
import {
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from '@repo/ui/components/ui/form'
import { Input } from '@repo/ui/components/ui/input'

const forgotPasswordSchema = z.object({
    email: z.string(),
})

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>

export default function ForgotPasswordPage() {
    const t = useTranslations('Auth')
    const [isPending, setIsPending] = React.useState(false)
    const [success, setSuccess] = React.useState('')
    const [error, setError] = React.useState('')

    const form = useForm<ForgotPasswordFormValues>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: '',
        },
    })

    const onSubmit = async (data: ForgotPasswordFormValues) => {
        setIsPending(true)
        setError('')
        setSuccess('')

        const formData = new FormData()
        formData.append('email', data.email)

        try {
            const result = await forgotPassword(formData)
            if (result?.error) {
                setError(result.error)
            } else if (result?.success) {
                setSuccess(result.success)
                form.reset()
            }
        } catch (err) {
            console.error(err)
            setError('An unexpected error occurred')
        } finally {
            setIsPending(false)
        }
    }

    return (
        <div className="mx-auto grid gap-6 w-full max-w-sm">
            <div className="grid gap-2 text-center">
                <h1 className="text-2xl font-bold">{t('forgotPassword')}</h1>
                <p className="text-muted-foreground text-sm">
                    Enter your email to reset your password
                </p>
            </div>

            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
                {error && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}
                {success && (
                    <Alert className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
                        <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                        <AlertDescription className="text-green-800 dark:text-green-300">
                            {success}
                        </AlertDescription>
                    </Alert>
                )}

                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }: { field: ControllerRenderProps<ForgotPasswordFormValues, 'email'> }) => (
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

            <div className="text-center text-sm">
                {t('rememberPassword')}{" "}
                <Link href="/login" className="underline text-primary">
                    {t('logIn')}
                </Link>
            </div>
        </div>
    )
}
