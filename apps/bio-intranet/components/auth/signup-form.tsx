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
    firstName: z.string().min(2, "First name must be at least 2 characters."),
    lastName: z.string().min(2, "Last name must be at least 2 characters."),
    email: z.string(),
    password: z.string().min(8, "Password must be at least 8 characters.")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter.")
        .regex(/[0-9]/, "Password must contain at least one number.")
        .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character."),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match.",
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
            } else if ((result?.errors as any)?.form) {
                setServerError((result.errors as any).form[0]);
            } else if (result?.errors) {
                // Handle field-specific errors from the server
                for (const key in result.errors) {
                    if (Object.prototype.hasOwnProperty.call(result.errors, key)) {
                        const fieldErrors = result.errors[key as keyof typeof result.errors] as string[];
                        if (fieldErrors && Array.isArray(fieldErrors) && fieldErrors.length > 0) {
                            form.setError(key as keyof SignupFormValues, {
                                type: 'server',
                                message: fieldErrors[0],
                            });
                        }
                    }
                }
            }
        } catch (err) {
            console.error(err);
            setServerError('An unexpected error occurred');
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
                        {t('accountCreated') || '¡Cuenta Creada!'}
                    </h2>
                    <div className="flex items-center justify-center gap-2 text-muted-foreground">
                        <p className="text-sm">
                            {t('checkEmailConfirm') || 'Por favor revisa tu correo electrónico para confirmar tu cuenta.'}
                        </p>
                    </div>
                </div>

                <Alert className="max-w-md bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
                    <AlertDescription className="text-blue-800 dark:text-blue-300">
                        {t('emailSentNote') || 'Te hemos enviado un enlace de confirmación. Revisa tu bandeja de entrada y spam.'}
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
                    render={({ field }: { field: ControllerRenderProps<SignupFormValues, 'firstName'> }) => (
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
                    render={({ field }: { field: ControllerRenderProps<SignupFormValues, 'lastName'> }) => (
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
                    render={({ field }: { field: ControllerRenderProps<SignupFormValues, 'email'> }) => (
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
                    render={({ field }: { field: ControllerRenderProps<SignupFormValues, 'password'> }) => (
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
                    render={({ field }: { field: ControllerRenderProps<SignupFormValues, 'confirmPassword'> }) => (
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
                            {t('or') || 'OR'}
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
                        // We need to get the locale somehow, or just pass it as 'es' default.
                        // Since this is a client component, we can use useLocale if needed.
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
