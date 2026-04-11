'use client';

import React from 'react';
import { signup } from '@/app/[locale]/(auth)/signup/actions';
import { PasswordStrength } from '@/components/auth/password-strength';
import { PasswordInput } from '@/components/auth/password-input';
import { useTranslations, useLocale } from 'next-intl';
import { Alert, AlertDescription } from '@repo/ui/components/ui/alert';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '@repo/ui/components/ui/button';
import { useForm, type ControllerRenderProps } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@repo/ui/components/ui/form';
import { Input } from '@repo/ui/components/ui/input';

const formSchema = z.object({
    firstName: z.string().min(2, "El nombre debe tener al menos 2 caracteres."),
    lastName: z.string().min(2, "El apellido debe tener al menos 2 caracteres."),
    email: z.string().email("Correo electrónico inválido."),
    password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres.")
        .regex(/[A-Z]/, "Debe tener al menos una mayúscula.")
        .regex(/[a-z]/, "Debe tener al menos una minúscula.")
        .regex(/[0-9]/, "Debe tener al menos un número.")
        .regex(/[^A-Za-z0-9]/, "Debe tener al menos un carácter especial."),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden.",
    path: ["confirmPassword"],
});

type SignupFormValues = z.infer<typeof formSchema>;

export default function SignupForm() {
    const t = useTranslations('Auth');
    const locale = useLocale();
    const [isPending, setIsPending] = React.useState(false);
    const [success, setSuccess] = React.useState(false);
    const [serverError, setServerError] = React.useState<string>('');

    const [checks, setChecks] = React.useState({
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        special: false,
    });

    const form = useForm<SignupFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
    });

    const handlePasswordChange = (val: string) => {
        setChecks({
            length: val.length >= 8,
            uppercase: /[A-Z]/.test(val),
            lowercase: /[a-z]/.test(val),
            number: /[0-9]/.test(val),
            special: /[^A-Za-z0-9]/.test(val),
        });
    };

    const onSubmit = async (data: SignupFormValues) => {
        setIsPending(true);
        setServerError('');

        const formData = new FormData();
        formData.append('firstName', data.firstName);
        formData.append('lastName', data.lastName);
        formData.append('email', data.email);
        formData.append('password', data.password);
        formData.append('confirmPassword', data.confirmPassword);

        try {
            const result = await signup(formData);

            if (result?.success) {
                setSuccess(true);
            } else if (result?.message) {
                setServerError(result.message);
            } else if (result?.errors) {
                // Handle field-specific errors
                Object.keys(result.errors).forEach((key) => {
                    const messages = result.errors![key as keyof typeof result.errors];
                    if (messages && messages) {
                        form.setError(key as any, { message: messages });
                    }
                });
            }
        } catch (err) {
            console.error(err);
            setServerError('Ha ocurrido un error inesperado');
        } finally {
            setIsPending(false);
        }
    };

    if (success) {
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
                        {t('accountCreated')}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        {t('checkEmailConfirm')}
                    </p>
                </div>

                <Alert className="max-w-md bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
                    <AlertDescription className="text-blue-800 dark:text-blue-300">
                        {t('emailSentNote')}
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 w-full">
                <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input placeholder={t('firstNamePlaceholder')} {...field} disabled={isPending} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input placeholder={t('lastNamePlaceholder')} {...field} disabled={isPending} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input placeholder={t('emailPlaceholder')} type="email" {...field} disabled={isPending} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <PasswordInput
                                    placeholder={t('passwordPlaceholder')}
                                    {...field}
                                    disabled={isPending}
                                    onChange={(e) => {
                                        field.onChange(e);
                                        handlePasswordChange(e.target.value);
                                    }}
                                />
                            </FormControl>
                            <PasswordStrength checks={checks} />
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <PasswordInput placeholder={t('confirmPasswordPlaceholder')} {...field} disabled={isPending} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {serverError && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{serverError}</AlertDescription>
                    </Alert>
                )}

                <Button type="submit" className="w-full" disabled={isPending}>
                    {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {t('createAccount')}
                </Button>

                <div className="relative my-2">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">
                            {t('or')}
                        </span>
                    </div>
                </div>

                <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    disabled={isPending}
                    onClick={async () => {
                        setIsPending(true);
                        const { loginWithGoogle } = await import('@/app/[locale]/(auth)/login/actions');
                        await loginWithGoogle(locale);
                    }}
                >
                    <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                        <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                    </svg>
                    {t('loginWithGoogle')}
                </Button>
            </form>
        </Form>
    );
}
