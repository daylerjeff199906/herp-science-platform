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
                        <div>
                            {/* Short summary or intro could go here but we use description */}
                        </div>

                        <div className="prose prose-slate dark:prose-invert max-w-none">
                            <h2 className="text-2xl font-semibold mb-4 border-b pb-2">Descripción</h2>
                            <div className="whitespace-pre-wrap text-muted-foreground mb-6">
                                {(typeof call.description === 'object' ? call.description?.[locale] : call.description) || 'No hay descripción detallada disponible.'}
                            </div>

                            {/* Rich Text Content */}
                            {call.content && (
                                <RichTextRenderer
                                    content={
                                        (() => {
                                            let d = call.content;
                                            if (typeof d === 'string') { try { d = JSON.parse(d); } catch (e) { return null; } }
                                            if (!d || typeof d !== 'object') return null;
                                            if (Array.isArray((d as any).blocks)) return d as any;
                                            const loc = (d as any)?.[locale];
                                            if (loc && Array.isArray(loc.blocks)) return loc;
                                            if (Array.isArray(d)) return { blocks: d };
                                            return null;
                                        })()
                                    }
                                />
                            )}
                        </div>

                        {/* Form Section */}
                        <div className="mt-12 bg-card rounded-xl border shadow-sm p-6 overflow-hidden">
                            <h2 className="text-lg mb-6 flex items-center">
                                Formulario de Postulación
                            </h2>

                            {isParticipant || existingApplication ? (
                                <div className="space-y-6">
                                    {isParticipant && (
                                        <div className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 p-6 rounded-lg flex items-start border border-green-200 dark:border-green-900/50">
                                            <CheckCircle2 className="h-6 w-6 mr-3 flex-shrink-0 mt-0.5" />
                                            <div>
                                                <h3 className="font-bold text-lg mb-1">Ya eres participante</h3>
                                                <p>Tu postulación fue aprobada y ya estás registrado oficialmente en este evento.</p>
                                            </div>
                                        </div>
                                    )}

                                    {existingApplication && (
                                        <div className="relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-primary/5 dark:from-blue-500/10 dark:to-primary/10 z-0" />
                                    <div className="relative z-10 p-8 space-y-6">
                                        <div className="text-center">
                                            <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4 ring-8 ring-blue-50 dark:ring-blue-900/10">
                                                <CheckCircle2 className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                                            </div>
                                            <h3 className="text-2xl font-bold tracking-tight">¡Ya estás en camino!</h3>
                                            <p className="text-muted-foreground max-w-md mx-auto">
                                                Tu postulación para <strong>{typeof call.title === 'object' ? call.title?.[locale] : call.title}</strong> fue recibida el {format(new Date(existingApplication.submitted_at), "d 'de' MMMM", { locale: es })}.
                                            </p>

                                            {/* 🟢 Mensaje según Rol y Tipo de Convocatoria Directa */}
                                            <div className="mt-4 p-4 bg-muted/50 rounded-lg border max-w-md mx-auto text-sm">
                                                {(() => {
                                                    const roleName = (typeof call.role?.name === 'object' ? call.role?.name?.[locale] : call.role?.name || 'Participante').toLowerCase();
                                                    const isDirect = call.is_direct || false; // Ajustar si es otro campo

                                                    let message = "Tu postulación se encuentra bajo revisión por el comité.";
                                                    if (isDirect) {
                                                        message = "Esta convocatoria es directa. Has sido registrado automáticamente.";
                                                    } else if (roleName.includes('expositor')) {
                                                        message = "Como Expositor, tu propuesta será evaluada por el comité revisor para la asignación de espacios.";
                                                    } else if (roleName.includes('coordinador') || roleName.includes('organizador')) {
                                                        message = "Tu rol de moderación/organización requiere validación de credenciales.";
                                                    }

                                                    return <p className="font-medium text-slate-800 dark:text-slate-200">ℹ️ {message}</p>;
                                                })()}
                                            </div>
                                        </div>

                                        <hr className="border-slate-100 dark:border-slate-800" />

                                        {/* 🟢 Resumen de la Postulación (Rol, Fecha, etc.) */}
                                        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs border rounded-xl p-4 bg-background dark:bg-muted/20 shadow-sm max-w-md mx-auto">
                                            <div>
                                                <span className="font-semibold text-muted-foreground">Rol Postulado</span>
                                                <p className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5 mt-0.5">
                                                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                                                    {typeof call.role?.name === 'object' ? call.role?.name?.[locale] : call.role?.name || 'Participante'}
                                                </p>
                                            </div>
                                            <div>
                                                <span className="font-semibold text-muted-foreground">Fecha de Postulación</span>
                                                <p className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5 mt-0.5">
                                                    <Calendar className="h-3.5 w-3.5 text-slate-400" />
                                                    {format(new Date(existingApplication.submitted_at), "dd/MM/yyyy")}
                                                </p>
                                            </div>
                                        </div>

                                        <hr className="border-slate-100 dark:border-slate-800" />

                                        {/* 🟢 Timeline de la Postulación */}
                                        <div className="space-y-4 max-w-md mx-auto">
                                            <h4 className="text-xs uppercase tracking-wider text-muted-foreground font-bold border-b pb-1">Historial de Seguimiento</h4>
                                            <div className="relative pl-4 border-l-2 border-slate-200 dark:border-slate-800 space-y-4">
                                                {(() => {
                                                    const sub = (existingApplication as any).submission;

                                                    // Si no existe submission (porque no subió archivos), construimos un timeline base con los datos de call_applications
                                                    const timeline = sub ? [
                                                        ...(sub.comments || []).map((c: any) => ({
                                                            type: 'comment',
                                                            id: `comment-${c.id}`,
                                                            date: new Date(c.created_at),
                                                            data: c
                                                        })),
                                                        ...(sub.history || []).map((h: any) => ({
                                                            type: 'history',
                                                            id: `history-${h.id}`,
                                                            date: new Date(h.created_at),
                                                            data: h
                                                        }))
                                                    ].sort((a: any, b: any) => a.date.getTime() - b.date.getTime()) : [
                                                        {
                                                            type: 'history',
                                                            id: 'initial',
                                                            date: new Date(existingApplication.submitted_at),
                                                            data: {
                                                                new_status: existingApplication.status,
                                                                justification: 'Postulación recibida y registrada en el sistema.',
                                                                created_at: existingApplication.submitted_at
                                                            }
                                                        }
                                                    ];

                                                    const statusConfig: Record<string, { label: string; color: string }> = {
                                                        draft: { label: 'Borrador', color: 'text-slate-500 bg-slate-100' },
                                                        submitted: { label: 'Presentado', color: 'text-blue-600 bg-blue-100' },
                                                        under_review: { label: 'En Revisión', color: 'text-amber-600 bg-amber-100' },
                                                        changes_requested: { label: 'Cambios Solicitados', color: 'text-orange-500 bg-orange-100' },
                                                        approved: { label: 'Aprobado', color: 'text-primary bg-primary/20' },
                                                        rejected: { label: 'Rechazado', color: 'text-rose-600 bg-rose-100' }
                                                    };

                                                    return timeline.map((item: any) => (
                                                        <div key={item.id} className="relative flex items-start gap-2">
                                                            <div className="absolute left-[-23px] w-4 h-4 rounded-full bg-white border border-slate-300 dark:bg-slate-900 flex items-center justify-center mt-1">
                                                                <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
                                                            </div>
                                                            <div className="flex-1 text-xs">
                                                                {item.type === 'comment' ? (
                                                                    <div>
                                                                        <span className="font-semibold">{item.data.author?.first_name || 'Comité'}:</span> {item.data.content}
                                                                    </div>
                                                                ) : (
                                                                    <div>
                                                                        <span className="text-muted-foreground">Estado: </span>
                                                                        <span className={`font-bold px-1 rounded ${statusConfig[item.data.new_status]?.color || 'bg-slate-100 border'}`}>{statusConfig[item.data.new_status]?.label || item.data.new_status}</span>
                                                                        {item.data.justification && <p className="mt-0.5 text-muted-foreground">"{item.data.justification}"</p>}
                                                                    </div>
                                                                )}
                                                                <span className="text-[10px] text-muted-foreground block mt-0.5">{format(item.date, "dd/MM/yyyy HH:mm")}</span>
                                                            </div>
                                                        </div>
                                                    ));
                                                })()}
                                            </div>
                                        </div>

                                        {existingApplication.submitted_data && Object.keys(existingApplication.submitted_data).length > 0 && (
                                            <div className="bg-background dark:bg-muted/30 rounded-xl p-4 text-left border shadow-sm max-w-md mx-auto mt-4 space-y-2">
                                                <h4 className="text-xs uppercase tracking-wider text-muted-foreground font-bold border-b pb-1">Datos Enviados</h4>
                                                <dl className="grid grid-cols-1 gap-x-4 gap-y-2">
                                                    {Object.entries(existingApplication.submitted_data).map(([key, value]) => {
                                                        const field = (call.form_schema as any[])?.find((f: any) => f.id === key);
                                                        const label = field?.label || key;
                                                        return (
                                                            <div key={key} className="flex flex-col">
                                                                <dt className="text-xs font-semibold text-foreground/80">{label}</dt>
                                                                <dd className="text-sm text-muted-foreground break-all">
                                                                    {typeof value === 'string' && value.startsWith('http') ? (
                                                                        <a href={value} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center">
                                                                            <FileText className="h-3.5 w-3.5 mr-1" /> Ver archivo
                                                                        </a>
                                                                    ) : typeof value === 'boolean' ? (value ? 'Sí' : 'No') : String(value)}
                                                                </dd>
                                                            </div>
                                                        )
                                                    })}
                                                </dl>
                                            </div>
                                        )}

                                        <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
                                            <Link href={`/${locale}/dashboard/convocatorias/mis-postulaciones`}>
                                                <Button variant="outline" className="rounded-full px-8">
                                                    Ver mis postulaciones
                                                </Button>
                                            </Link>
                                            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-sm font-bold uppercase tracking-wider border border-blue-500/20">
                                                Estado: {existingApplication.status === 'approved' ? 'Aprobada' : existingApplication.status === 'draft' ? 'Recibida' : existingApplication.status}
                                            </div>

                                            </div>

                                            </div>

                                            </div>

                                            </div>
) : isClosed ? (
                                <div className="space-y-6 w-full">
                                    <div className="bg-muted p-6 text-center rounded-lg border">
                                        <p className="text-muted-foreground font-medium">Esta convocatoria ya no acepta postulaciones.</p>
                                    </div>
                                    {call.form_schema && (call.form_schema as any[]).length > 0 && userProfile && (
                                        <div className="border rounded-xl p-6 bg-background dark:bg-muted/10 opacity-75">
                                            <h4 className="text-sm font-semibold mb-2 text-muted-foreground">Formulario (Modo Vista - Convocatoria Cerrada)</h4>
                                            <ApplicationClient
                                                callId={call.id}
                                                schema={call.form_schema || []}
                                                profileId={userProfile.id}
                                                locale={locale}
                                                call={call}
                                                disabled={true}
                                            />
                                        </div>
                                    )}
                                </div>
                            ) : userProfile ? (
                                <ApplicationClient
                                    callId={call.id}
                                    schema={call.form_schema || []}
                                    profileId={userProfile.id}
                                    locale={locale}
                                    call={call}
                                />
                            ) : (
                                <div className="bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 p-6 rounded-lg flex items-start">
                                    <Info className="h-6 w-6 mr-3 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <h3 className="font-bold">Debes completar tu perfil</h3>
                                        <p>No se pudo encontrar tu perfil de usuario. Por favor, asegúrate de haber completado tu registro.</p>
                                    </div>
                                </div>
                            )}
                        </div>
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
