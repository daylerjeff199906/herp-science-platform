import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { getTranslations } from 'next-intl/server'
import { LayoutWrapper } from '@/components/layout-wrapper'
import { notFound } from 'next/navigation'
import { Calendar, Users, Info, FileText, ArrowLeft, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { ApplicationClient } from './application-client'
import ApplicationStatus from './application-status'
import { RichTextRenderer } from '@/components/RichTextRenderer'
import { LocalizedRichTextContent } from '@/types/editor'

export default async function ConvocatoriaDetailPage({ params }: { params: Promise<{ locale: string, id: string }> }) {
    const { locale, id } = await params;
    const t = await getTranslations({ locale });
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    // Fetch the call details
    const { data: call, error } = await supabase
        .from('event_calls')
        .select(`
      *,
      role:participant_roles(name),
      main_event:main_events(name, cover_url, logo_url),
      edition:editions(name, cover_url),
      content
    `)
        .eq('id', id)
        .single()

    if (error || !call) {
        notFound()
    }


    // Get user session to check if already applied
    const { data: { user } } = await supabase.auth.getUser()

    let existingApplication = null
    let userProfile = null
    let isParticipant = false

    if (user) {
        // Get profile
        const { data: profile } = await supabase
            .from('profiles')
            .select('id')
            .eq('auth_id', user.id)
            .single()

        userProfile = profile

        // Check if applied
        if (profile) {
            const { data: maxApp } = await supabase
                .from('call_applications')
                .select('id, status, submitted_at, submitted_data')
                .eq('call_id', call.id)
                .eq('profile_id', profile.id)
                .maybeSingle()

            existingApplication = maxApp
            // Fetch submission with history for the tracking timeline
            if (maxApp) {
                const { data: submission } = await supabase
                    .from('event_submissions')
                    .select(`
                        id,
                        status,
                        history:submission_history(
                            id,
                            old_status,
                            new_status,
                            justification,
                            created_at,
                            profile:profiles(first_name, last_name, email)
                        ),
                        comments:submission_comments(
                            id,
                            content,
                            created_at,
                            author:profiles(first_name, last_name, email)
                        )
                    `)
                    .eq('call_id', call.id)
                    .eq('profile_id', profile.id)
                    .maybeSingle();
                if (submission) {
                    existingApplication = {
                        ...existingApplication,
                        submission: submission
                    };
                }
            }

            // Check if already is participant
            if (call.main_event_id) {
                const { data: part } = await supabase
                    .from('event_participants')
                    .select('id')
                    .eq('profile_id', profile.id)
                    .eq('main_event_id', call.main_event_id)
                    .eq('role_id', call.role_id)
                    .maybeSingle()
                isParticipant = !!part
            } else if (call.edition_id) {
                const { data: part } = await supabase
                    .from('event_participants')
                    .select('id')
                    .eq('profile_id', profile.id)
                    .eq('edition_id', call.edition_id)
                    .eq('role_id', call.role_id)
                    .maybeSingle()
                isParticipant = !!part
            }
        }
    }

    const isClosed = new Date() > new Date(call.end_date)

    return (
        <LayoutWrapper sectionTitle={t('Navigation.convocatorias')}>
            <div className="container mx-auto p-4 md:p-6 lg:p-8 max-w-6xl">
                <div className="mb-6">
                    <Link href={`/${locale}/dashboard/convocatorias`}>
                        <Button variant="ghost" size="sm" className="pl-0 text-muted-foreground hover:text-foreground">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Volver a Convocatorias
                        </Button>
                    </Link>
                </div>

                {/* Hero Section */}
                <div className="relative mb-8 overflow-hidden rounded-2xl bg-muted shadow-lg ring-1 ring-border">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10" />

                    {/* Hero Image */}
                    <div className="aspect-[21/9] w-full">
                        {(call.image_url || call.main_event?.cover_url || call.edition?.cover_url || call.main_event?.logo_url) ? (
                            <img
                                src={call.image_url || call.main_event?.cover_url || call.edition?.cover_url || call.main_event?.logo_url}
                                alt={typeof call.title === 'object' ? call.title?.[locale] : call.title}
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
                                <Calendar className="h-20 w-20 text-primary/30" />
                            </div>
                        )}
                    </div>

                    {/* Content Overlay */}
                    <div className="absolute bottom-0 left-0 w-full p-6 md:p-10 z-20 text-white">
                        <div className="flex flex-wrap items-center gap-3 mb-4">
                            <span className="inline-flex items-center rounded-full bg-white/20 backdrop-blur-md px-3 py-1 text-sm font-bold border border-white/30">
                                {typeof call.role?.name === 'object' ? call.role?.name?.[locale] : call.role?.name || 'Participante'}
                            </span>
                            {isClosed ? (
                                <span className="inline-flex items-center rounded-full bg-red-500/80 backdrop-blur-md px-3 py-1 text-sm font-bold border border-red-500/50">
                                    Convocatoria Cerrada
                                </span>
                            ) : (
                                <span className="inline-flex items-center rounded-full bg-green-500/80 backdrop-blur-md px-3 py-1 text-sm font-bold border border-green-500/50">
                                    Postulaciones Abiertas
                                </span>
                            )}
                        </div>

                        <h1 className="text-3xl md:text-5xl lg:text-6xl tracking-tighter mb-4 drop-shadow-sm">
                            {typeof call.title === 'object' ? call.title?.[locale] : call.title}
                        </h1>

                        <div className="flex items-center text-base font-medium text-white/90">
                            <Info className="mr-2 h-4 w-4" />
                            {(typeof call.main_event?.name === 'object' ? call.main_event?.name?.[locale] : call.main_event?.name) ||
                                (typeof call.edition?.name === 'object' ? call.edition?.name?.[locale] : call.edition?.name) ||
                                'Evento General'}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main content - 2 columns on large screens */}
                    <div className="lg:col-span-2 space-y-8">
                        <ApplicationStatus 
                            isParticipant={isParticipant}
                            existingApplication={existingApplication}
                            isClosed={isClosed}
                            call={call}
                            userProfile={userProfile}
                            locale={locale}
                        />
                    </div>
                    

                    {/* Right sidebar details */}
                    <div className="space-y-6">
                        <div className="bg-muted/40 rounded-xl border p-6 space-y-6 sticky top-6">
                            <h3 className="font-semibold text-lg border-b pb-2">Detalles clave</h3>

                            <div className="space-y-4">
                                <div className="flex gap-3">
                                    <Calendar className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                                    <div>
                                        <p className="font-medium text-sm">Fecha de Inicio</p>
                                        <p className="text-foreground">
                                            {format(new Date(call.start_date), "dd/MM/yyyy", { locale: es })}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <Calendar className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                                    <div>
                                        <p className="font-medium text-sm">Fecha de Cierre</p>
                                        <p className="text-foreground">
                                            {format(new Date(call.end_date), "dd/MM/yyyy", { locale: es })}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <Users className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                                    <div>
                                        <p className="font-medium text-sm">Capacidad</p>
                                        <p className="text-foreground">
                                            {call.max_capacity ? `${call.max_capacity} cupos` : 'Ilimitada'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 border-t">
                                {isParticipant ? (
                                    <Button className="w-full bg-green-600 hover:bg-green-700 text-white" disabled>
                                        <CheckCircle2 className="mr-2 h-4 w-4" /> Ya estás registrado
                                    </Button>
                                ) : existingApplication ? (
                                    <Button className="w-full" variant="outline" disabled>Postulación en proceso</Button>
                                ) : isClosed ? (
                                    <Button className="w-full" variant="secondary" disabled>Convocatoria Cerrada</Button>
                                ) : (
                                    <Link href="#application-form" className="w-full">
                                        <Button className="w-full">
                                            ¡Postular Abajo!
                                        </Button>
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </LayoutWrapper>
    )
}
