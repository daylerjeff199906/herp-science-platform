import { fetchIndividuals } from '@repo/networking'
import { IIndividualFilterParams } from '@/types'
import { CollectionsView } from '@/components/collections/CollectionsView'
import { SearchParams } from '@repo/shared-types'
import { Metadata } from 'next'

interface IProps {
  searchParams: SearchParams
}

export async function generateMetadata(): Promise<Metadata> {
  const meta = {
    title: `COLECCIONES | BUSQUEDAD AVANZADA`,
    description:
      'Encuentra la colección que buscas en nuestra plataforma de consultas.',
    openGraph: {
      images: [
        {
          url: 'https://firebasestorage.googleapis.com/v0/b/species-iiap-bb45a.appspot.com/o/amphibians%2Findividuials-amphibians.webp?alt=media&token=9331cabe-1adb-4b8b-8554-2d5f21e5e14f',
          width: 800,
          height: 600,
          alt: 'Og Image Alt',
        },
      ],
    },
  }

  return meta
}

export default async function Page(props: IProps) {
  const searchParams = await props.searchParams

  const {
    searchTerm,
    endDate,
    endTime,
    startDate,
    startTime,
    barcode,
    classId,
    orderId,
    genusId,
    familyId,
    countryId,
    departmentId,
    districtId,
    localityId,
    provinceId,
    forestTypeId,
    hasEggs,
    museumId,
    occurrenceId,
    sexId,
    orderBy,
    orderType,
    page,
    pageSize,
    hasImages,
    hasCoordinates,
    hasSounds
  } = searchParams as unknown as IIndividualFilterParams
  const view = searchParams.view || undefined

  const res = await fetchIndividuals({
    searchTerm: searchTerm || undefined,
    barcode: Number(barcode) || undefined,
    dateRange: {
      endDate: endDate || '',
      startDate: startDate || '',
    },
    timeRange: {
      endTime: endTime || '',
      startTime: startTime || '',
    },
    taxonomicFilter: {
      classId: classId ? Number(classId) : undefined,
      orderId: orderId ? Number(orderId) : undefined,
      familyId: familyId ? Number(familyId) : undefined,
      genusId: genusId ? Number(genusId) : undefined,
    },
    geographicFilter: {
      countryId: countryId ? Number(countryId) : undefined,
      departmentId: departmentId ? Number(departmentId) : undefined,
      provinceId: provinceId ? Number(provinceId) : undefined,
      districtId: districtId ? Number(districtId) : undefined,
      localityId: localityId ? Number(localityId) : undefined,
    },
    forestTypeId: forestTypeId ? Number(forestTypeId) : undefined,
    hasEggs: hasEggs ? Number(hasEggs) : undefined,
    page: page ? Number(page) : undefined,
    pageSize: pageSize ? Number(pageSize) : 20,
    sexId: sexId ? Number(sexId) : undefined,
    museumId: museumId ? Number(museumId) : undefined,
    orderBy: orderBy || undefined,
    orderType: orderType as 'ASC' | 'DESC' | undefined,
    ocurrenceId: occurrenceId ? Number(occurrenceId) : undefined,
    hasImages: hasImages ? Number(hasImages) : view === 'gallery' ? 1 : undefined,
    hasCoordinates: hasCoordinates ? Number(hasCoordinates) : undefined,
    hasSounds: hasSounds ? Number(hasSounds) : undefined,
  })
  return <>
    <CollectionsView data={res} />
  </>
}

export const dynamic = 'force-dynamic'