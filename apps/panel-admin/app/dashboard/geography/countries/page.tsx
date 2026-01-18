import { fetchCountriesAdmin } from '@/services/countries'
import { SearchParams } from '@repo/shared-types/types'
// import { PaginationCustom } from '@/modules/core'
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

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Países</h1>
        <p className="text-muted-foreground">Administra el catálogo de países del sistema.</p>
      </div>

      <CountriesView countries={allCountries.data} />

      <div className="mt-4">
        {/* <PaginationCustom count={allCountries?.totalPages} page_size={10} /> */}
      </div>
    </div>
  )
}

export const dynamic = 'force-dynamic'

