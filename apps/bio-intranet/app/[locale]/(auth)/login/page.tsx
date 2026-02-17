'use client'

import * as React from 'react'
import { useForm, type ControllerRenderProps } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTranslations, useLocale } from 'next-intl'
import { login } from './actions'
import { PasswordInput } from '@/components/auth/password-input'
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
import { Checkbox } from '@repo/ui/components/ui/checkbox'
import { Label } from '@repo/ui/components/ui/label'
import { Loader2 } from 'lucide-react'

const loginSchema = z.object({
    email: z.string(),
    password: z.string().min(1),
    rememberMe: z.boolean().optional(),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function LoginPage() {
    const t = useTranslations('Auth')
    const locale = useLocale()
    const router = useRouter()
    const [error, setError] = React.useState<string>('')
    const [isPending, setIsPending] = React.useState(false)

    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
            rememberMe: false,
        },
    })

    const onSubmit = async (data: LoginFormValues) => {
        setIsPending(true)
        setError('')

        const formData = new FormData()
        formData.append('email', data.email)
        formData.append('password', data.password)

        try {
            const result = await login(formData, locale)

            if (result?.error) {
                setError(result.error)
            } else if (result?.redirectUrl) {
                router.push(result.redirectUrl)
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
                <h1 className="text-2xl font-bold">{t('login')}</h1>
                <p className="text-muted-foreground text-sm">
                    {t('loginDescription')}
                </p>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
                    {error && (
                        <Alert variant="destructive">
                            <AlertDescription>
                                {t.has(`Errors.${error}`) ? t(`Errors.${error}`) : error}
                            </AlertDescription>
                        </Alert>
                    )}

                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }: { field: ControllerRenderProps<LoginFormValues, 'email'> }) => (
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

                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }: { field: ControllerRenderProps<LoginFormValues, 'password'> }) => (
                            <FormItem>
                                <div className="flex items-center justify-end">
                                    <Link
                                        href="/forgot-password"
                                        className="text-xs text-primary underline-offset-4 hover:underline"
                                    >
                                        {t('forgotPassword')}?
                                    </Link>
                                </div>
                                <FormControl>
                                    <PasswordInput
                                        placeholder={t('passwordPlaceholder')}
                                        disabled={isPending}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="rememberMe"
                        render={({ field }: { field: ControllerRenderProps<LoginFormValues, 'rememberMe'> }) => (
                            <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                                <FormControl>
                                    <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                        disabled={isPending}
                                    />
                                </FormControl>
                                <Label
                                    htmlFor="rememberMe"
                                    className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                >
                                    {t('rememberMe')}
                                </Label>
                            </FormItem>
                        )}
                    />

                    <Button type="submit" className="w-full" disabled={isPending}>
                        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {t('logIn')}
                    </Button>
                </form>
            </Form>

            <div className="text-center text-sm">
                {t('dontHaveAccount')}{" "}
                <Link href="/signup" className="underline text-primary">
                    {t('signup')}
                </Link>
            </div>
        </div>
    )
}
