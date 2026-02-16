import { notFound } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { fetchIndividualByUuidAdmin } from '@/services/individuals'
import { fetchSexes, fetchMuseums } from '@repo/networking'
import { IndividualForm } from '@/components/forms/individual-form'
import { LayoutWrapper } from '@/components/layout-wrapper'
import { ROUTES } from '@/config'

interface PageProps {
  params: Promise<{ uuid: string }>
}

export default async function Page({ params }: PageProps) {
  const { uuid } = await params

  const [individual, sexes, museums] = await Promise.all([
    fetchIndividualByUuidAdmin(uuid),
    fetchSexes({ page: 1, pageSize: 100 }),
    fetchMuseums({ page: 1, pageSize: 100 }),
  ])

  if (!individual) {
    notFound()
  }

  // TODO: Implementar servicios para activities y forestTypes
  const activities = { data: [] }
  const forestTypes = { data: [] }

  return (
    <LayoutWrapper
      sectionTitle="Editar Individuo"
      breadcrumbs={[
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Principal', href: '#' },
        { title: 'Individuos', href: ROUTES.CORE.INDIVIDUALS },
        { title: individual.code || 'Editar' },
      ]}
    >
      <Card>
        <CardHeader className="py-3">
          <CardTitle className="text-sm font-semibold">
            Información del Individuo
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <IndividualForm
            initialData={individual}
            sexes={sexes.data}
            activities={activities.data}
            museums={museums.data}
            forestTypes={forestTypes.data}
          />
        </CardContent>
      </Card>
    </LayoutWrapper>
  )
}
