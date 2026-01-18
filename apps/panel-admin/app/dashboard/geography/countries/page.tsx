import { ListCountries } from '@/modules/admin'
import { fetchCountriesAdmin } from '@/api/app/locations/countries'
import { SearchParams } from '@/types'
import { PaginationCustom } from '@/modules/core'

interface IPageProps {
  searchParams?: SearchParams
}

export default async function Page(props: IPageProps) {
  const SearchParams = await props.searchParams

  const allCountries = await fetchCountriesAdmin({
    page: SearchParams?.page ? Number(SearchParams.page) : 1,
    name: SearchParams?.name ? String(SearchParams.name) : undefined,
  })

  return (
    <>
      <ListCountries countriesData={allCountries} />
      <PaginationCustom count={allCountries?.totalPages} page_size={10} />
    </>
  )
}

export const dynamic = 'force-dynamic' // Force dynamic rendering for this page
