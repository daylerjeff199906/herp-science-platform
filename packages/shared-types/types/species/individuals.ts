import { PaginationParams } from "../core";
import { Museum } from "../institutions";
import { ForestType } from "../others";
import { Sex } from "./sexes";



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

interface BaseEntity {
    id: number;
    name?: string;
    status: number;
    createdAt: string;
    updatedAt: string;
}

export interface Activity extends BaseEntity {
    name: string;
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

export interface IndividualFile {
    id: number;
    name: string;
    type: string;
    format: string;
    size: string | null;
    note: string | null;
    samplingSite: string;
    order: number;
    // url?: string; // Adding optional url as it seems to be used in the component
}

export interface Individual {
    id: number;
    code: string | null;
    weight: string | null;
    slaughteredWeight: string | null;
    svl: string | null;
    tailLength: string | null;
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
        images: IndividualFile[];
        audios: IndividualFile[];
    };
    activity: Activity;
    forestType: ForestType | null;
    museum: Museum;
    identifiers: unknown[];
    ocurrence: Occurrence;
    species: TaxonomySpecies;
}

export interface IndividualResponse {
    data: Individual[];
    currentPage: number;
    totalPages: number;
    totalItems: number;
}

// For details
export interface Person extends BaseEntity {
    firstname: string;
    lastname: string;
    email: string | null;
    phone: string | null;
    ctiVitae: string | null;
    image: string | null;
}

export interface PersonRelation {
    id: number;
    createdAt: string;
    person: Person;
}

export interface IndividualDetails extends Omit<Individual, 'identifiers' | 'sex' | 'activity' | 'museum'> {
    sex: Sex | null;
    activity: Activity | null;
    museum: Museum | null;
    identifiers: PersonRelation[];
}
