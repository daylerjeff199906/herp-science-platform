
import { fetchIndividuals } from '@repo/networking'
import { IIndividualFilterParams } from '@/types'
import { VisorView } from '@/components/visor/VisorView'
import { SearchParams } from '@repo/shared-types'
import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

interface IProps {
    searchParams: Promise<SearchParams>
    params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params
    const t = await getTranslations({ locale, namespace: 'Header.nav' })

    return {
        title: `${t('visor')} | Herp Science Platform`,
        description: 'Visualizador geográfico de especies.',
    }
}

export default async function VisorPage(props: IProps) {
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
        // hasCoordinates, // We force this later
        hasSounds
    } = searchParams as unknown as IIndividualFilterParams

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
        page: page ? Number(page) : 1,
        pageSize: pageSize ? Number(pageSize) : 100, // Default 100 as requested
        sexId: sexId ? Number(sexId) : undefined,
        museumId: museumId ? Number(museumId) : undefined,
        orderBy: orderBy || undefined,
        orderType: orderType as 'ASC' | 'DESC' | undefined,
        ocurrenceId: occurrenceId ? Number(occurrenceId) : undefined,
        hasImages: hasImages ? Number(hasImages) : undefined,
        hasCoordinates: 1, // Force coordinates for map
        hasSounds: hasSounds ? Number(hasSounds) : undefined,
    })

    // We pass the response to the client view
    // Note: We might need to handle empty states or loading states in the client component
    return <VisorView data={res} />
}
