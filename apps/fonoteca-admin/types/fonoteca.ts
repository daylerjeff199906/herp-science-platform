export interface Location {
  id: string;
  locationID: string | null;
  continent: string;
  country: string;
  countryCode: string;
  stateProvince: string | null;
  county: string | null;
  locality: string;
  decimalLatitude: number | null;
  decimalLongitude: number | null;
  coordinateUncertaintyInMeters: number | null;
  elevation: number | null;
  elevationAccuracy: number | null;
  habitat: string | null;
  created_at: string;
}

export interface Taxon {
  id: string;
  taxonID: string | null;
  scientificName: string;
  acceptedNameUsage: string | null;
  kingdom: string;
  phylum: string | null;
  class: string | null;
  order: string | null;
  family: string | null;
  genus: string | null;
  specificEpithet: string | null;
  infraspecificEpithet: string | null;
  taxonRank: string;
  scientificNameAuthorship: string | null;
  vernacularName: string | null;
  nomenclaturalCode: string;
  created_at: string;
}

export interface Occurrence {
  id: string;
  occurrenceID: string;
  taxon_id: string;
  location_id: string;
  profile_id: string;
  basisOfRecord: string;
  institutionCode: string;
  collectionCode: string;
  catalogNumber: string | null;
  recordedBy: string;
  identifiedBy: string | null;
  eventDate: string;
  eventTime: string | null;
  samplingProtocol: string | null;
  lifeStage: string | null;
  sex: string | null;
  reproductiveCondition: string | null;
  occurrenceRemarks: string | null;
  created_at: string;

  // Joins (optional)
  taxon?: Taxon;
  location?: Location;
}

export interface Multimedia {
  id: string;
  occurrence_id: string;
  identifier: string;
  type: string;
  format: string;
  order_index: number;
  title: string | null;
  description: string | null;
  creator: string;
  rightsHolder: string;
  license: string;
  equipmentUsed: string | null;
  software: string | null;
  samplingRate: number | null;
  bitrate: string | null;
  audioChannel: string | null;
  lensAperture: string | null;
  exposureTime: string | null;
  iso: number | null;
  focalLength: string | null;
  created_at: string;
  tag: string | null;
  parent_multimedia_id: string | null;

  // Joins (optional)
  occurrence?: Occurrence;
}
