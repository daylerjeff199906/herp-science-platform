import { z } from "zod";

// Helper tool to handle numeric fields from HTML inputs that send empty strings.
const numberOrNull = z.preprocess(
  (v) => (v === "" || v === undefined || v === null ? null : v),
  z.coerce.number().nullable().optional()
);

// --- Locations ---
export const locationSchema = z.object({
  id: z.string().optional(),
  locationID: z.string().optional().nullable(),
  continent: z.string(),
  country: z.string(),
  countryCode: z.string(),
  stateProvince: z.string().optional().nullable(),
  county: z.string().optional().nullable(),
  locality: z.string().min(1, "Locality is required"),
  decimalLatitude: numberOrNull,
  decimalLongitude: numberOrNull,
  coordinateUncertaintyInMeters: numberOrNull,
  elevation: numberOrNull,
  elevationAccuracy: numberOrNull,
  habitat: z.string().optional().nullable(),
});

export type LocationInput = z.infer<typeof locationSchema>;

// --- Taxa ---
export const taxonSchema = z.object({
  id: z.string().uuid().optional(),
  taxonID: z.string().optional().nullable(),
  scientificName: z.string().min(1, "Scientific Name is required"),
  acceptedNameUsage: z.string().optional().nullable(),
  kingdom: z.string().default("Animalia"),
  phylum: z.string().optional().nullable(),
  class: z.string().optional().nullable(),
  order: z.string().optional().nullable(),
  family: z.string().optional().nullable(),
  genus: z.string().optional().nullable(),
  specificEpithet: z.string().optional().nullable(),
  infraspecificEpithet: z.string().optional().nullable(),
  taxonRank: z.string(),
  scientificNameAuthorship: z.string().optional().nullable(),
  vernacularName: z.string().optional().nullable(),
  nomenclaturalCode: z.string(),
});

export type TaxonInput = z.infer<typeof taxonSchema>;

// --- Occurrences ---
export const occurrenceSchema = z.object({
  id: z.string().uuid().optional(),
  occurrenceID: z.string().min(1, "Occurrence ID is required"),
  taxon_id: z.string().uuid("Invalid Taxon ID"),
  location_id: z.string().uuid("Invalid Location ID"),
  profile_id: z.string().uuid("Invalid Profile ID"),
  basisOfRecord: z.string().min(1, "Basis of record is required"),
  institutionCode: z.string(),
  collectionCode: z.string(),
  catalogNumber: z.string().optional().nullable(),
  recordedBy: z.string().min(1, "Recorded By is required"),
  identifiedBy: z.string().optional().nullable(),
  eventDate: z.string().min(1, "Event Date is required"), // YYYY-MM-DD
  eventTime: z.string().optional().nullable(), // HH:MM:SS
  samplingProtocol: z.string().optional().nullable(),
  lifeStage: z.string().optional().nullable(),
  sex: z.string().optional().nullable(),
  reproductiveCondition: z.string().optional().nullable(),
  occurrenceRemarks: z.string().optional().nullable(),
});

export type OccurrenceInput = z.infer<typeof occurrenceSchema>;

// --- Multimedia ---
export const multimediaSchema = z.object({
  id: z.string().uuid().optional(),
  occurrence_id: z.string().uuid("Invalid Occurrence ID"),
  identifier: z.string().min(1, "Identifier is required"), // URL or path
  type: z.string().min(1, "Type is required"), // Still, Sound, MovingImage
  format: z.string().min(1, "Format is required"), // audio/mp3, video/mp4
  order_index: z.coerce.number().default(0),
  title: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  creator: z.string().min(1, "Creator is required"),
  rightsHolder: z.string().default("Instituto de Investigaciones de la Amazonía Peruana (IIAP)"),
  license: z.string().default("http://creativecommons.org/licenses/by-nc/4.0/"),
  equipmentUsed: z.string().optional().nullable(),
  software: z.string().optional().nullable(),
  samplingRate: numberOrNull,
  bitrate: z.string().optional().nullable(),
  audioChannel: z.string().optional().nullable(),
  lensAperture: z.string().optional().nullable(),
  exposureTime: z.string().optional().nullable(),
  iso: numberOrNull,
  focalLength: z.string().optional().nullable(),
  tag: z.string().optional().nullable(),
  parent_multimedia_id: z.string().uuid().optional().nullable(),
});

export type MultimediaInput = z.infer<typeof multimediaSchema>;
