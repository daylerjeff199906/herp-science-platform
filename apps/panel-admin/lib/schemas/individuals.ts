
import { z } from 'zod'

// Shared schemas for sub-objects
export const taxonomicSchema = z.object({
  classId: z.number().optional(),
  orderId: z.number().optional(),
  familyId: z.number().optional(),
  genusId: z.number().optional(),
  speciesId: z.number().optional(),
})

export const geographicSchema = z.object({
  countryId: z.number().optional(),
  departmentId: z.number().optional(),
  provinceId: z.number().optional(),
  districtId: z.number().optional(),
  localityId: z.number().optional(),
})

export const dateRangeSchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
})

export const timeRangeSchema = z.object({
  startTime: z.string().optional(),
  endTime: z.string().optional(),
})

// 1. General Information Schema
export const individualGeneralSchema = z.object({
  speciesId: z.number().min(1, 'La especie es requerida'),
  sexId: z.number().min(1, 'El sexo es requerido'),
  museumId: z.number().min(1, 'El museo es requerido'),
  occurrenceId: z.number().min(1, 'La ocurrencia es requerida'),
  forestId: z.number().min(1, 'El tipo de bosque es requerido'),
  activityId: z.number().min(1, 'La actividad es requerida'),
  code: z.string().min(1, 'El código es requerido'),
  weight: z.number().optional(),
  slaughteredWeight: z.number().optional(),
  svl: z.number().optional(),
  tailLength: z.number().optional(),
  hasEggs: z.boolean().optional(),
  identDate: z.string().optional(),
  identTime: z.string().optional(),
  geneticBarcode: z.string().optional(),
  depositCodeGenbank: z.string().optional().or(z.literal('')),
  status: z.number(),
})

export type IndividualGeneralFormValues = z.infer<typeof individualGeneralSchema>

// 2. Multimedia (Image) Schema
export const individualMultimediaSchema = z.object({
  file: z.instanceof(File, { message: 'El archivo es requerido' }),
  samplingSite: z.enum(['EN_CAMPO', 'EN_ESTUDIO']).optional(),
  note: z.string().optional(),
  personId: z.coerce.number().optional(),
})

export type IndividualMultimediaFormValues = z.infer<typeof individualMultimediaSchema>

// 3. Audio Schema
export const individualAudioSchema = z.object({
  file: z.instanceof(File, { message: 'El archivo de audio es requerido' }),
  samplingSite: z.enum(['EN_CAMPO', 'EN_ESTUDIO']).optional(),
  note: z.string().optional(),
  personId: z.coerce.number().optional(),
  files: z.array(z.instanceof(File)).max(10).optional(), // Histograms
})

export type IndividualAudioFormValues = z.infer<typeof individualAudioSchema>

// File Order Schema (Drag and Drop)
export const fileOrderSchema = z.object({
  fileType: z.enum(['AUDIO', 'IMAGE', 'HISTOGRAM']),
  fileIds: z.array(z.string()),
})

export type FileOrderValues = z.infer<typeof fileOrderSchema>

// Individual Filter Schema
export const individualFilterSchema = z.object({
  searchTerm: z.string().optional(),
  hasEggs: z.number().optional(),
  hasImages: z.number().optional(),
  barcode: z.number().optional(),
  sexId: z.number().optional(),
  museumId: z.number().optional(),
  forestTypeId: z.number().optional(),
  activityId: z.number().optional(),
  eventId: z.number().optional(),
  occurrenceId: z.number().optional(),
  taxonomicFilter: taxonomicSchema.optional(),
  geographicFilter: geographicSchema.optional(),
  dateRange: dateRangeSchema.optional(),
  timeRange: timeRangeSchema.optional(),
  orderBy: z.string().default('createdAt'),
  orderType: z.enum(['ASC', 'DESC']).default('DESC'),
  page: z.number().default(1),
  pageSize: z.number().default(10),
})

export type IndividualFilterValues = z.infer<typeof individualFilterSchema>
export type TaxonomicFormValues = z.infer<typeof taxonomicSchema>
export type GeographicFormValues = z.infer<typeof geographicSchema>
export type DateRangeFormValues = z.infer<typeof dateRangeSchema>
export type TimeRangeFormValues = z.infer<typeof timeRangeSchema>
