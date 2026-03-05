'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import DynamicApplicationForm from '@/components/DynamicApplicationForm'
import { createClient } from '@/utils/supabase/client'
import { FormField } from '@/types/forms'

export function ApplicationClient({
    callId,
    schema,
    profileId,
}: {
    callId: string
    schema: FormField[]
    profileId: string
}) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()
    const supabase = createClient()

    const handleSubmit = async (data: Record<string, any>) => {
        setIsSubmitting(true)
        setError(null)

        try {
            const { error: submitError } = await supabase
                .from('call_applications')
                .insert({
                    call_id: callId,
                    profile_id: profileId,
                    submitted_data: data,
                    status: 'draft',
                    submitted_at: new Date().toISOString(),
                })

            if (submitError) throw submitError

            router.refresh()
        } catch (err: any) {
            console.error('Error submitting application:', err)
            setError(err.message || 'Ocurrió un error al enviar tu postulación. Por favor intenta de nuevo.')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div id="application-form">
            {error && (
                <div className="mb-4 p-4 text-red-600 bg-red-50 dark:bg-red-950/20 dark:text-red-400 rounded-md border border-red-200 dark:border-red-900/50">
                    {error}
                </div>
            )}
            <DynamicApplicationForm
                schema={schema}
                onSubmit={handleSubmit}
                isLoading={isSubmitting}
            />
        </div>
    )
}
