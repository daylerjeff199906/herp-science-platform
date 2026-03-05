import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { getTranslations } from 'next-intl/server'
import { LayoutWrapper } from '@/components/layout-wrapper'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import Link from 'next/link'
import { Calendar, CheckCircle2, Clock, Award, FileText, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

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
                edition:editions(name, cover_url)
            )
        `)
        .eq('profile_id', user.id)
        .order('submitted_at', { ascending: false })

    return (
        <LayoutWrapper sectionTitle={t('Navigation.misPostulaciones')}>
            <div className="container mx-auto p-4 md:p-6 lg:p-8 space-y-8">
                <div>
                    <h1 className="text-3xl font-bold font-black tracking-tight uppercase">Mi Historial de Participación</h1>
                    <p className="text-muted-foreground mt-2">
                        Consulta el estado de tus postulaciones y participaciones en eventos de investigación.
                    </p>
                </div>

                {appError && (
                    <div className="p-4 text-red-500 bg-red-50 rounded-lg border border-red-100">
                        Error al cargar el historial: {appError.message}
                    </div>
                )}

                {applications && applications.length > 0 ? (
                    <div className="space-y-6">
                        {applications.map((app: any) => {
                            const call = app.call;
                            const callTitle = typeof call?.title === 'object' ? call.title?.[locale] : call?.title;
                            const roleName = typeof call?.role?.name === 'object' ? call.role?.name?.[locale] : call?.role?.name || 'Participante';
                            const eventName = (typeof call?.main_event?.name === 'object' ? call.main_event?.name?.[locale] : call?.main_event?.name) ||
                                (typeof call?.edition?.name === 'object' ? call.edition?.name?.[locale] : call?.edition?.name) ||
                                'Evento General';

                            const isApproved = app.status === 'approved';

                            return (
                                <div key={app.id} className="group relative overflow-hidden bg-card rounded-2xl border shadow-sm transition-all hover:shadow-md">
                                    <div className="flex flex-col md:flex-row">
                                        {/* Status Sidebar */}
                                        <div className={`w-2 ${isApproved ? 'bg-green-500' : 'bg-blue-500'}`} />

                                        <div className="flex-1 p-6">
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                                        <Clock className="w-3 h-3" />
                                                        Postulado el {format(new Date(app.submitted_at), "PPP", { locale: es })}
                                                    </div>
                                                    <h2 className="text-xl font-bold group-hover:text-primary transition-colors">
                                                        {callTitle}
                                                    </h2>
                                                </div>

                                                <div className={`inline-flex items-center px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${isApproved
                                                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                                    : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                                    }`}>
                                                    {isApproved ? (
                                                        <><CheckCircle2 className="w-3 h-3 mr-1.5" /> Aprobada</>
                                                    ) : (
                                                        <><Clock className="w-3 h-3 mr-1.5" /> En Revisión</>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 py-4 border-y border-border/50">
                                                <div className="space-y-1">
                                                    <p className="text-xs text-muted-foreground uppercase font-medium">Evento</p>
                                                    <p className="font-semibold">{eventName}</p>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-xs text-muted-foreground uppercase font-medium">Rol</p>
                                                    <p className="font-semibold">{roleName}</p>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-xs text-muted-foreground uppercase font-medium">Certificación</p>
                                                    <p className="text-muted-foreground text-sm flex items-center italic">
                                                        {isApproved ? 'Próximamente disponible' : 'Pendiente de aprobación'}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="mt-4 flex justify-end items-center">
                                                <Link href={`/${locale}/dashboard/convocatorias/${call.id}`}>
                                                    <Button variant="ghost" size="sm" className="group/btn text-primary">
                                                        Ver Convocatoria <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-muted/20 rounded-3xl border border-dashed">
                        <FileText className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />
                        <h3 className="text-xl font-bold uppercase tracking-tight">No tienes postulaciones aún</h3>
                        <p className="text-muted-foreground mb-6">Explora las convocatorias abiertas y comienza tu participación.</p>
                        <Link href={`/${locale}/dashboard/convocatorias`}>
                            <Button className="rounded-full px-8 bg-black text-white hover:bg-black/90 uppercase font-bold tracking-widest">
                                Ver Convocatorias
                            </Button>
                        </Link>
                    </div>
                )}
            </div>
        </LayoutWrapper>
    )
}
