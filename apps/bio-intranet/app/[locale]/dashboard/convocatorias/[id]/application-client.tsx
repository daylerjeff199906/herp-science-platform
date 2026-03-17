'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import DynamicApplicationForm from '@/components/DynamicApplicationForm'
import { createClient } from '@/utils/supabase/client'
import { FormField } from '@/types/forms'
import confetti from 'canvas-confetti'
import { notifyApplicationSuccess } from '@/app/actions/convocatorias'
import { toast } from 'sonner'

export function ApplicationClient({
    callId,
    schema,
    profileId,
    locale,
    call,
    disabled = false,
    initialSubmissionId = null,
    initialDataProp = {}
}: {
    callId: string
    schema: FormField[]
    profileId: string
    locale: string
    call: any
    disabled?: boolean
    initialSubmissionId?: string | null
    initialDataProp?: Record<string, any>
}) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [submissionId, setSubmissionId] = useState<string | null>(initialSubmissionId)
    const [initialData, setInitialData] = useState<Record<string, any>>(initialDataProp)

    const router = useRouter()
    const supabase = createClient()

    const isAutoApproved = call?.auto_approve;
    const statusCall = isAutoApproved ? 'approved' : 'submitted';

    // Cargar borrador (Draft) cargado previamente o actualizar de props
    useEffect(() => {
        if (submissionId) return; // Ya se cargó desde Props

        const fetchDraft = async () => {
            const { data: draft } = await supabase
                .from('event_submissions')
                .select('id, metadata')
                .eq('call_id', callId)
                .eq('profile_id', profileId)
                .eq('status', 'draft')
                .maybeSingle()

            if (draft) {
                setSubmissionId(draft.id)
                setInitialData(draft.metadata || {})
            }
        }
        fetchDraft()
    }, [callId, profileId, supabase])

    const handleFileUploadSuccess = async (id: string, url: string, file: File) => {
        try {
            let currentSubId = submissionId;

            // 1. Crear event_submission si no existe
            if (!currentSubId) {
                const { data: sub, error: subError } = await supabase
                    .from('event_submissions')
                    .insert({
                        profile_id: profileId,
                        call_id: callId,
                        main_event_id: call.main_event_id,
                        edition_id: call.edition_id,
                        title: `Postulación - ${typeof call.title === 'object' ? call.title?.[locale] : call.title}`,
                        status: 'draft',
                        metadata: { [id]: url },
                        is_admin_upload: false
                    })
                    .select('id')
                    .single()

                if (subError) throw subError;
                currentSubId = sub.id;
                setSubmissionId(sub.id);
            } else {
                // Actualizar metadata
                const updatedMetadata = { ...initialData, [id]: url };
                setInitialData(updatedMetadata);
                await supabase
                    .from('event_submissions')
                    .update({ metadata: updatedMetadata })
                    .eq('id', currentSubId);
            }

            // 2. Insertar archivo en la tabla de archivos
            await supabase.from('submission_files').insert({
                submission_id: currentSubId,
                file_name: file.name,
                file_url: url,
                document_type: 'application_file',
                mime_type: file.type,
                size_bytes: file.size
            });

        } catch (err) {
            console.error('Error guardando progreso:', err);
        }
    };

    const handleFileRemoved = async (id: string, url: string) => {
        try {
            if (!submissionId) return;

            // 1. Eliminar de la tabla de archivos
            await supabase
                .from('submission_files')
                .delete()
                .eq('submission_id', submissionId)
                .eq('file_url', url);

            // 2. Limpiar metadata en event_submissions
            const updatedMetadata = { ...initialData };
            delete updatedMetadata[id];
            setInitialData(updatedMetadata);

            await supabase
                .from('event_submissions')
                .update({ metadata: updatedMetadata })
                .eq('id', submissionId);

            // 3. También limpiar submitted_data en call_applications (si ya fue enviada)
            const { data: existingApp } = await supabase
                .from('call_applications')
                .select('submitted_data')
                .eq('call_id', callId)
                .eq('profile_id', profileId)
                .maybeSingle();

            if (existingApp?.submitted_data) {
                const updatedSubmittedData = { ...existingApp.submitted_data };
                delete updatedSubmittedData[id];
                await supabase
                    .from('call_applications')
                    .update({ submitted_data: updatedSubmittedData })
                    .eq('call_id', callId)
                    .eq('profile_id', profileId);
            }

            // 4. Eliminar del storage de Cloudflare R2
            try {
                await fetch('/api/r2/delete', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ url }),
                });
            } catch (r2err) {
                console.error('Error deleting file from R2:', r2err);
            }

        } catch (err) {
            console.error('Error quitando registro de archivo:', err);
        }
    };

    const handleSubmit = async (data: Record<string, any>) => {
        setIsSubmitting(true)
        setError(null)

        try {
            const { error: submitError } = await supabase
                .from('call_applications')
                .upsert({
                    call_id: callId,
                    profile_id: profileId,
                    submitted_data: data,
                    status: statusCall,
                    submitted_at: new Date().toISOString(),
                }, { onConflict: 'call_id, profile_id' })

            if (submitError) throw submitError

            // Actualizar estado del borrador a enviado si existe
            if (submissionId) {
                await supabase
                    .from('event_submissions')
                    .update({ status: statusCall, metadata: data })
                    .eq('id', submissionId);
            }

            // Launch confetti!
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
                zIndex: 999
            })

            toast.success(locale === 'es' ? '¡Postulación enviada con éxito!' : 'Application submitted successfully!')

            // Send confirmation email in background
            notifyApplicationSuccess({ callId, profileId, locale }).catch(console.error)

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
                initialData={initialData}
                disabled={disabled}
                onFileUploadSuccess={handleFileUploadSuccess}
                onFileRemoved={handleFileRemoved}
            />
        </div>
    )
}
