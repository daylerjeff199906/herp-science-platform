export interface IIndividualFilterParams {
    searchTerm?: string
    endDate?: string
    endTime?: string
    startDate?: string
    startTime?: string
    barcode?: string
    classId?: string
    orderId?: string
    genusId?: string
    familyId?: string
    countryId?: string
    departmentId?: string
    districtId?: string
    localityId?: string
    provinceId?: string
    forestTypeId?: string
    hasEggs?: string
    museumId?: string
    occurrenceId?: string
    sexId?: string
    orderBy?: string
    orderType?: 'ASC' | 'DESC'
    page?: string
    pageSize?: string
}

export type SearchParams = { [key: string]: string | string[] | undefined }
