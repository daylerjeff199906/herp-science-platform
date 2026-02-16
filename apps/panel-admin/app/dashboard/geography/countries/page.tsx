import { fetchCountriesAdmin } from '@/services/countries'
import { SearchParams } from '@repo/shared-types'
import { CountriesView } from './components/countries-view'

interface IPageProps {
  searchParams?: Promise<SearchParams>
}

export default async function Page(props: IPageProps) {
  const params = await props.searchParams

  const allCountries = await fetchCountriesAdmin({
    page: params?.page ? Number(params.page) : 1,
    name: params?.name ? String(params.name) : undefined,
  })

  return <CountriesView countries={allCountries.data} />
}

export const dynamic = 'force-dynamic'

