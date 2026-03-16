import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { getTranslations } from 'next-intl/server'
import { LayoutWrapper } from '@/components/layout-wrapper'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import Link from 'next/link'
import { CheckCircle2, Clock, FileText, ArrowRight, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { HeaderSection } from '@/components/header-section'
import { EmptyState } from '@/components/empty-state'

export default async function MisPostulacionesPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale });
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    // Get current user profile
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return (
            <LayoutWrapper sectionTitle={t('Navigation.misPostulaciones')}>
                <div className="container mx-auto p-8 text-center">
                    <p>Por favor, inicia sesión para ver tus postulaciones.</p>
                </div>
            </LayoutWrapper>
        )
    }

    // Get profile
    const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('auth_id', user.id)
        .single()

    const profileId = profile?.id || user.id; // fallback if they are using same in some tables

    // Fetch applications
    const { data: applications, error: appError } = await supabase
        .from('call_applications')
        .select(`
            *,
            call:event_calls(
                id,
                title,
                role:participant_roles(name),
                main_event:main_events(name, cover_url),
                edition:editions(name, cover_url),
                form_schema
            )
        `)
        .eq('profile_id', profileId)
        .order('submitted_at', { ascending: false })

    return (
        <LayoutWrapper sectionTitle={t('Navigation.misPostulaciones')}>
            <div className="container mx-auto p-4 md:p-6 lg:p-8 space-y-8">
                <HeaderSection
                    title="Mi Historial de Participación"
                    description="Consulta el estado de tus postulaciones y participaciones en eventos de investigación."
                />

                {appError && (
                    <div className="p-4 text-red-500 bg-red-50 rounded-lg border border-red-100 text-sm">
                        Error al cargar el historial: {appError.message}
                    </div>
                )}

                {applications && applications.length > 0 ? (
                    <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-sm">
                        <table className="w-full text-sm text-left border-collapse">
                            <thead>
                                <tr className="border-b bg-muted/30">
                                    <th className="px-6 py-4 font-medium text-muted-foreground w-[40%] text-xs uppercase tracking-wider">Convocatoria</th>
                                    <th className="px-6 py-4 font-medium text-muted-foreground text-xs uppercase tracking-wider">Rol</th>
                                    <th className="px-6 py-4 font-medium text-muted-foreground text-xs uppercase tracking-wider">Fecha</th>
                                    <th className="px-6 py-4 font-medium text-muted-foreground text-xs uppercase tracking-wider text-center">Estado</th>
                                    <th className="px-6 py-4 font-medium text-muted-foreground text-right text-xs uppercase tracking-wider">Acción</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {applications.map((app: any) => {
                                    const call = app.call;
                                    const callTitle = typeof call?.title === 'object' ? call.title?.[locale] : call?.title;
                                    const roleName = typeof call?.role?.name === 'object' ? call.role?.name?.[locale] : call?.role?.name || 'Participante';
                                    const eventName = (typeof call?.main_event?.name === 'object' ? call.main_event?.name?.[locale] : call?.main_event?.name) ||
                                        (typeof call?.edition?.name === 'object' ? call.edition?.name?.[locale] : call?.edition?.name) ||
                                        'Evento General';

                                    const isApproved = app.status === 'approved';

                                    return (
                                        <tr key={app.id} className="group hover:bg-muted/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-0.5">
                                                    <span className="font-bold text-foreground group-hover:text-primary transition-colors">
                                                        {callTitle}
                                                    </span>
                                                    <span className="text-[11px] text-muted-foreground">
                                                        {eventName}
                                                    </span>

                                                    {app.submitted_data && Object.keys(app.submitted_data).length > 0 && (
                                                        <details className="mt-2 text-[11px] group/details">
                                                            <summary className="cursor-pointer text-muted-foreground group-hover/details:text-primary font-medium flex items-center transition-colors">
                                                                <FileText className="w-3.5 w-3.5 mr-1" /> Ver datos enviados
                                                            </summary>
                                                            <ul className="mt-1.5 space-y-1 pl-3 border-l-2 border-primary/20 bg-muted/20 p-2 rounded-md">
                                                                {Object.entries(app.submitted_data).map(([key, value]) => {
                                                                    const field = (call?.form_schema as any[])?.find((f: any) => f.id === key);
                                                                    const label = field?.label || key;
                                                                    return (
                                                                        <li key={key} className="break-all text-muted-foreground">
                                                                            <span className="font-semibold text-foreground/80">{label}:</span>{' '}
                                                                            {typeof value === 'string' && value.startsWith('http') ? (
                                                                                <a href={value} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium inline-flex items-center">
                                                                                     <ExternalLink className="h-2.5 w-2.5 mr-0.5" /> Ver archivo
                                                                                </a>
                                                                            ) : typeof value === 'boolean' ? (value ? 'Sí' : 'No') : String(value)}
                                                                        </li>
                                                                    )
                                                                })}
                                                            </ul>
                                                        </details>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-muted-foreground font-medium">{roleName}</span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex flex-col gap-0.5 text-muted-foreground">
                                                    <span>{format(new Date(app.submitted_at), "dd MMM yyyy", { locale: es })}</span>
                                                    <span className="text-[10px] opacity-70">{format(new Date(app.submitted_at), "HH:mm")}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex justify-center">
                                                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${isApproved
                                                        ? 'bg-green-50 text-green-700 border-green-100 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800/50'
                                                        : 'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800/50'
                                                        }`}>
                                                        {isApproved ? (
                                                            <><CheckCircle2 className="w-3 h-3 mr-1.5" /> Aprobada</>
                                                        ) : (
                                                            <><Clock className="w-3 h-3 mr-1.5" /> En Revisión</>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Link href={`/${locale}/dashboard/convocatorias/${call?.id}`}>
                                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full hover:bg-primary/10 hover:text-primary">
                                                        <ExternalLink className="w-4 h-4" />
                                                        <span className="sr-only">Ver</span>
                                                    </Button>
                                                </Link>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <EmptyState
                        title="No tienes postulaciones aún"
                        description="Explora las convocatorias abiertas y comienza tu participación."
                        className="py-12"
                    />
                )}
            </div>
        </LayoutWrapper>
    )
}
