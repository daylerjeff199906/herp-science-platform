export interface FamilyCount {
    [familyName: string]: number;
}

export interface OrderCount {
    [orderName: string]: number | FamilyCount[];
    families: FamilyCount[];
}

export interface TaxonStats {
    total: number;
    lastRegistration: string;
    orders: OrderCount[];
}

export interface GeneralCounter {
    allIndividuals: number;
    publishedIndividuals: number;
    unpublishedIndividuals: number;
    deletedIndividuals: number;
    publishedAmphibians: TaxonStats;
    publishedReptiles: TaxonStats;
}
