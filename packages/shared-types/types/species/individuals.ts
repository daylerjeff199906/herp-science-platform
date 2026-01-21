export interface PaginationParams {
    page: number;
    pageSize: number;
}

export interface TaxonomicFilter {
    classId?: number;
    orderId?: number;
    familyId?: number;
    genusId?: number;
    speciesId?: number;
}

export interface GeographicFilter {
    countryId?: number;
    departmentId?: number;
    provinceId?: number;
    districtId?: number;
    localityId?: number;
}

export interface DateRangeFilter {
    startDate?: string;
    endDate?: string;
}

export interface TimeRangeFilter {
    startTime?: string;
    endTime?: string;
}

export interface IndividualFilter extends PaginationParams {
    hasEggs?: number;
    hasImages?: number;
    barcode?: number;
    orderBy?: string;
    orderType?: 'ASC' | 'DESC';
    searchTerm?: string;
    forestTypeId?: number;
    activityId?: number;
    sexId?: number;
    museumId?: number;
    eventId?: number;
    ocurrenceId?: number;
    taxonomicFilter?: TaxonomicFilter;
    geographicFilter?: GeographicFilter;
    dateRange?: DateRangeFilter;
    timeRange?: TimeRangeFilter;
}

export interface BaseEntity {
    id: number;
    name?: string;
    status: number;
    createdAt: string;
    updatedAt: string;
}

export interface Sex extends BaseEntity {
    name: string;
}

export interface Activity extends BaseEntity {
    name: string;
}

export interface ForestType extends BaseEntity {
    name: string;
}

export interface Institution extends BaseEntity {
    name: string;
}

export interface Museum extends BaseEntity {
    name: string;
    acronym: string;
    institution: Institution;
}

export interface Person {
    id: number;
    firstname: string;
    lastname: string;
    email: string | null;
    phone: string | null;
    ctiVitae: string | null;
    image: string | null;
    status: number;
    createdAt: string;
    updatedAt: string;
}

export interface Collector {
    id: number;
    createdAt: string;
    person: Person;
}

export interface ResponseCountry extends BaseEntity {
    name: string;
}

export interface ResponseDepartment extends BaseEntity {
    name: string;
    country: ResponseCountry;
}

export interface ResponseProvince extends BaseEntity {
    name: string;
    department: ResponseDepartment;
}

export interface ResponseDistrict extends BaseEntity {
    name: string;
    ubigeo: string;
    province: ResponseProvince;
}

export interface ResponseLocality extends BaseEntity {
    name: string;
    description: string | null;
    district: ResponseDistrict;
}

export interface ResponseEvent {
    id: number;
    note: string | null;
    date: string;
    latitude: string;
    longitude: string;
    status: number;
    createdAt: string;
    updatedAt: string;
    locality: ResponseLocality;
}

export interface Occurrence {
    id: number;
    individualCount: number;
    date: string;
    status: number;
    createdAt: string;
    updatedAt: string;
    collectors: Collector[];
    event: ResponseEvent;
}

export interface TaxonomyClass extends BaseEntity {
    name: string;
}

export interface TaxonomyOrder extends BaseEntity {
    name: string;
    class: TaxonomyClass;
}

export interface TaxonomyFamily extends BaseEntity {
    name: string;
    order: TaxonomyOrder;
}

export interface TaxonomyGenus extends BaseEntity {
    name: string;
    family: TaxonomyFamily;
}

export interface TaxonomySpecies {
    id: number;
    commonName: string | null;
    scientificName: string;
    description: string | null;
    status: number;
    createdAt: string;
    updatedAt: string;
    genus: TaxonomyGenus;
}

export interface Individual {
    id: number;
    code: string | null;
    weight: string;
    slaughteredWeight: string | null;
    svl: string;
    tailLength: string;
    hasEggs: boolean;
    identDate: string;
    identTime: string;
    geneticBarcode: string | null;
    depositCodeGenbank: string | null;
    status: number;
    createdAt: string;
    updatedAt: string;
    sex: Sex;
    files: {
        images: any[];
        audios: any[];
    };
    activity: Activity;
    forestType: ForestType | null;
    museum: Museum;
    identifiers: any[];
    ocurrence: Occurrence;
    species: TaxonomySpecies;
}

export interface IndividualResponse {
    data: Individual[];
    currentPage: number;
    totalPages: number;
    totalItems: number;
}
