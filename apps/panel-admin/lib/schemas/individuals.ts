import { z } from 'zod'

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

export const individualSchema = z.object({
  code: z.string().min(1, 'El código es requerido'),
  weight: z.string().optional(),
  slaughteredWeight: z.string().optional(),
  svl: z.string().optional(),
  tailLength: z.string().optional(),
  hasEggs: z.boolean().default(false),
  identDate: z.string().min(1, 'La fecha de identificación es requerida'),
  identTime: z.string().min(1, 'La hora de identificación es requerida'),
  geneticBarcode: z.string().optional(),
  depositCodeGenbank: z.string().optional(),
  sexId: z.number().min(1, 'El sexo es requerido'),
  activityId: z.number().min(1, 'La actividad es requerida'),
  forestTypeId: z.number().optional(),
  museumId: z.number().min(1, 'El museo es requerido'),
  speciesId: z.number().min(1, 'La especie es requerida'),
  occurrenceId: z.number().optional(),
  identifiers: z.array(z.number()).default([]),
})

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

export type IndividualFormValues = z.infer<typeof individualSchema>
export type IndividualFilterValues = z.infer<typeof individualFilterSchema>
export type TaxonomicFormValues = z.infer<typeof taxonomicSchema>
export type GeographicFormValues = z.infer<typeof geographicSchema>
export type DateRangeFormValues = z.infer<typeof dateRangeSchema>
export type TimeRangeFormValues = z.infer<typeof timeRangeSchema>
