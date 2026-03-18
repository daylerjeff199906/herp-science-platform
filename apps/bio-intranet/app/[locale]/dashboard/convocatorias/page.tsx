import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { getTranslations } from 'next-intl/server'
import { LayoutWrapper } from '@/components/layout-wrapper'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import Link from 'next/link'
import { Calendar } from 'lucide-react'
import { HeaderSection } from '@/components/header-section'
import { EmptyState } from '@/components/empty-state'
import { CallFilters } from './call-filters'
import { Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton'

export default async function ConvocatoriasPage({
    params,
    searchParams
}: {
    params: Promise<{ locale: string }>,
    searchParams: Promise<{ status?: string, year?: string }>
}) {
    const { locale } = await params;
    const t = await getTranslations({ locale });
    const { status = 'active', year } = await searchParams;
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    // Build query
    let query = supabase
        .from('event_calls')
        .select(`
            *,
            role:participant_roles(name),
            main_event:main_events(name, cover_url, logo_url),
            edition:editions(name, cover_url)
        `)
        .order('created_at', { ascending: false })

    const now = new Date().toISOString();

    // Apply status filter
    if (status === 'active') {
        query = query.eq('is_active', true).gte('end_date', now)
    } else if (status === 'past') {
        query = query.or(`is_active.eq.false,end_date.lt.${now}`)
    }

    // Apply year filter if present
    if (year && year !== 'all') {
        query = query.gte('end_date', `${year}-01-01`).lte('end_date', `${year}-12-31`)
    }

    const { data: calls, error } = await query

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 5 }, (_, i) => (currentYear - i).toString());

    return (
        <LayoutWrapper sectionTitle={t('Navigation.convocatorias')}>
            <div className="container mx-auto p-4 space-y-8">
                <HeaderSection
                    title="Convocatorias"
                    description="Explora las oportunidades disponibles para unirte a proyectos y eventos en diferentes roles."
                />

                {/* Filters Section */}
                <Suspense fallback={<div className="flex gap-4"><Skeleton className="h-10 w-[160px]" /><Skeleton className="h-10 w-[140px]" /></div>}>
                    <CallFilters years={years} locale={locale} />
                </Suspense>

                {error && (
                    <div className="min-h-32 flex items-center justify-center text-red-500 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-900">
                        Error al cargar convocatorias: {error.message}
                    </div>
                )}

                {!error && (!calls || calls.length === 0) ? (
                    <EmptyState
                        title="No se encontraron convocatorias"
                        description={status === 'active' ? "No hay convocatorias activas en este momento." : "No se encontraron resultados para los filtros aplicados."}
                        className="py-20"
                    />
                ) : (
                    <div className="grid gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
                        {calls?.map((call) => {
                            const callImage = call.image_url || call.main_event?.cover_url || call.edition?.cover_url || call.main_event?.logo_url;
                            const eventName = (typeof call.main_event?.name === 'object' ? call.main_event?.name?.[locale] : call.main_event?.name) ||
                                (typeof call.edition?.name === 'object' ? call.edition?.name?.[locale] : call.edition?.name) ||
                                'Evento General';
                            const callTitle = typeof call.title === 'object' ? call.title?.[locale] : call.title;
                            const callDesc = typeof call.description === 'object' ? call.description?.[locale] : call.description;
                            const callRole = typeof call.role?.name === 'object' ? call.role?.name?.[locale] : call.role?.name || 'Participante';

                            return (
                                <div key={call.id} className="group flex flex-col space-y-4 transition-all duration-300">
                                    {/* Top Header: Date */}
                                    <div className="flex flex-col space-y-2">
                                        <div className="flex items-center space-x-2">
                                            <span className="text-lg font-bold text-foreground">
                                                Hasta {format(new Date(call.end_date), "MMM d", { locale: es })}
                                            </span>
                                            <span className="text-muted-foreground">|</span>
                                            <span className="text-sm text-muted-foreground font-medium">
                                                {call.is_active ? 'Postulaciones abiertas' : 'Convocatoria cerrada'}
                                            </span>
                                        </div>
                                        <div className="h-[1px] w-full bg-border" />
                                    </div>

                                    {/* Main Image */}
                                    <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-muted shadow-sm ring-1 ring-border transition-all duration-300 group-hover:shadow-md group-hover:ring-primary/20 max-h-48">
                                        {callImage ? (
                                            <img
                                                src={callImage}
                                                alt={callTitle}
                                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 max-h-48"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-muted to-muted/50">
                                                <Calendar className="h-12 w-12 text-muted-foreground/30" />
                                            </div>
                                        )}
                                        {/* Role Badge Over Image */}
                                        <div className="absolute left-3 top-3">
                                            <span className="inline-flex items-center rounded-full bg-background backdrop-blur-sm border px-2.5 py-0.5 text-xs font-bold text-foreground shadow-sm">
                                                {callRole}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Content Details */}
                                    <div className="flex flex-1 flex-col space-y-2 px-1">
                                        <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                            {eventName}
                                        </div>
                                        <h3 className="text-xl font-bold leading-tight tracking-tight text-foreground group-hover:text-primary transition-colors">
                                            {callTitle}
                                        </h3>
                                        <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                                            {callDesc}
                                        </p>
                                    </div>

                                    {/* Footer Action */}
                                    <div className="pt-2 px-1">
                                        <Link href={`/${locale}/dashboard/convocatorias/${call.id}`}>
                                            <Button className="h-11 rounded-full bg-black px-6 font-bold uppercase tracking-widest text-white transition-all hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90">
                                                Ver Convocatoria <span className="ml-2">→</span>
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </LayoutWrapper>
    )
}
