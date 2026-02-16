import { fetchCountriesAdmin } from '@/services/countries'
import { SearchParams } from '@repo/shared-types'
import { CountriesView } from './components/countries-view'
import { LayoutWrapper } from '@/components/layout-wrapper'

interface IPageProps {
  searchParams?: Promise<SearchParams>
}

export default async function Page(props: IPageProps) {
  const params = await props.searchParams

  const allCountries = await fetchCountriesAdmin({
    page: params?.page ? Number(params.page) : 1,
    name: params?.name ? String(params.name) : undefined,
  })

  return (
    <LayoutWrapper
      sectionTitle="Gestión de Países"
      breadcrumbs={[
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Ubicación', href: '#' },
        { title: 'Países' },
      ]}
    >
      <CountriesView countries={allCountries.data} />
    </LayoutWrapper>
  )
}

export const dynamic = 'force-dynamic'
