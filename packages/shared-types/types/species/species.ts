import { PaginationData, BaseEntity, PaginationParams } from "../core";
import { Genus } from "./genera";

export interface Species extends BaseEntity {
    id: string;
    scientificName: string;
    commonName: string;
    description: string;
    status: string;
    genus: Genus;
}

export interface SpeciesParams extends PaginationParams {
    searchTerm: string
    genusId: string
}

export interface SpeciesData extends PaginationData<Species> { }
