"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { SecurityProfileSchema, SecurityProfileData } from "@/lib/schemas/profile"
import { updateSecurityProfile } from "@/app/[locale]/dashboard/profile/actions"
import { useTranslations } from "next-intl"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@repo/ui"
import { Input } from "@repo/ui"
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react"
import { Separator } from "@repo/ui"
import { Alert, AlertDescription, AlertTitle } from "@repo/ui"

interface SecurityFormProps {
    email: string
    locale: string
}

export function SecurityForm({ email, locale }: SecurityFormProps) {
    const t = useTranslations('Profile')
    const [isPending, setIsPending] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const form = useForm<SecurityProfileData>({
        resolver: zodResolver(SecurityProfileSchema),
        defaultValues: {
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
        },
    })

    async function onSubmit(data: SecurityProfileData) {
        setIsPending(true)
        setError(null)
        setSuccess(false)
        try {
            const response = await updateSecurityProfile(locale, data)
            if (response.error) {
                setError(response.error)
            } else {
                setSuccess(true)
                form.reset()
            }
        } catch (error) {
            setError(t('messages.updateError'))
        } finally {
            setIsPending(false)
        }
    }

    return (
        <div className="space-y-6">
            {success && (
                <Alert className="border-green-500 text-green-600 bg-green-50">
                    <CheckCircle2 className="h-4 w-4" />
                    <AlertTitle>Success</AlertTitle>
                    <AlertDescription>{t('messages.passwordUpdateSuccess')}</AlertDescription>
                </Alert>
            )}

            {error && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <div className="space-y-4">
                <h4 className="text-sm font-medium">{t('security.accountDetails')}</h4>
                <div className="grid gap-1">
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">{t('form.email')}</label>
                    <div className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50">
                        {email}
                        {/* Badge Verified? */}
                        <span className="ml-auto text-green-600 text-xs flex items-center">{t('messages.emailVerified')}</span>
                    </div>
                </div>
            </div>

            <Separator />

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <h4 className="text-sm font-medium">{t('form.changePassword')}</h4>
                    <FormField
                        control={form.control}
                        name="newPassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t('form.newPassword')}</FormLabel>
                                <FormControl>
                                    <Input type="password" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t('form.confirmPassword')}</FormLabel>
                                <FormControl>
                                    <Input type="password" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="flex justify-end gap-4">
                        <Button type="submit" disabled={isPending}>
                            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {t('form.changePassword')}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}
