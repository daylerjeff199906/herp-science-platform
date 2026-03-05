import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { getTranslations } from 'next-intl/server'
import { LayoutWrapper } from '@/components/layout-wrapper'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import Link from 'next/link'
import { Calendar, Users, Eye } from 'lucide-react'

export default async function ConvocatoriasPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale });
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    // Fetch active calls
    const { data: calls, error } = await supabase
        .from('event_calls')
        .select(`
      *,
      role:participant_roles(name),
      main_event:main_events(title),
      edition:editions(title)
    `)
        .eq('is_active', true)
        .order('created_at', { ascending: false })

    return (
        <LayoutWrapper sectionTitle={t('Navigation.convocatorias')}>
            <div className="container mx-auto p-4 md:p-6 lg:p-8 space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Convocatorias Abiertas</h1>
                    <p className="text-muted-foreground mt-2">
                        Explora las oportunidades disponibles para unirte a proyectos y eventos en diferentes roles.
                    </p>
                </div>

                {error && (
                    <div className="min-h-32 flex items-center justify-center text-red-500 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-900">
                        Error al cargar convocatorias: {error.message}
                    </div>
                )}

                {!error && (!calls || calls.length === 0) && (
                    <div className="min-h-64 flex flex-col items-center justify-center text-muted-foreground bg-muted/30 rounded-lg border border-dashed">
                        <Calendar className="h-12 w-12 mb-4 text-muted-foreground/50" />
                        <p>No hay convocatorias activas en este momento.</p>
                    </div>
                )}

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {calls?.map((call) => (
                        <Card key={call.id} className="flex flex-col">
                            <CardHeader>
                                <div className="flex justify-between items-start mb-2">
                                    <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                                        {call.role?.name || 'Participante'}
                                    </span>
                                    {call.max_capacity && (
                                        <span className="inline-flex items-center text-xs text-muted-foreground">
                                            <Users className="w-3 h-3 mr-1" />
                                            Cupos: {call.max_capacity}
                                        </span>
                                    )}
                                </div>
                                <CardTitle className="text-xl">{call.title}</CardTitle>
                                <CardDescription>
                                    {call.main_event?.title || call.edition?.title || 'Evento General'}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1">
                                <p className="text-sm text-foreground/80 line-clamp-3 mb-4">
                                    {call.description}
                                </p>
                                <div className="space-y-2 text-sm text-muted-foreground">
                                    <div className="flex items-center">
                                        <Calendar className="mr-2 h-4 w-4" />
                                        <span>
                                            Cierra: {format(new Date(call.end_date), "dd 'de' MMMM, yyyy", { locale: es })}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Link href={`/${locale}/dashboard/convocatorias/${call.id}`} className="w-full">
                                    <Button className="w-full group">
                                        <Eye className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                                        Ver Detalles
                                    </Button>
                                </Link>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
        </LayoutWrapper>
    )
}
