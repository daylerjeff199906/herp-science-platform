import { z } from 'zod'

export const dedicationOptions = [
  'full_time',
  'part_time',
  'freelance',
  'student',
  'researcher',
  'professor',
  'other',
] as const

export const PersonalInfoSchema = z.object({
  birthDate: z
    .string()
    .min(1, 'Onboarding.Errors.birthDateRequired')
    .refine(
      (date) => {
        const parsed = new Date(date)
        const today = new Date()
        const minDate = new Date()
        minDate.setFullYear(today.getFullYear() - 100)
        return parsed <= today && parsed >= minDate
      },
      { message: 'Onboarding.Errors.birthDateInvalid' }
    ),
  location: z.string().optional(),
  phone: z
    .string()
    .optional()
    .refine(
      (phone) => {
        if (!phone) return true
        const phoneRegex =
          /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,4}[-\s\.]?[0-9]{1,9}$/
        return phoneRegex.test(phone)
      },
      { message: 'Invalid phone number format' }
    ),
  bio: z.string().max(1000, 'Bio must be less than 1000 characters').optional(),
})

export const ProfessionalInfoSchema = z.object({
  dedication: z.enum(dedicationOptions).optional(),
  institution: z.string().optional(),
})

export const InterestsSchema = z.object({
  areasOfInterest: z
    .array(z.string())
    .min(1, 'Onboarding.Errors.areasRequired')
    .max(10, 'Select up to 10 areas'),
  expertiseAreas: z
    .array(z.string())
    .max(10, 'Select up to 10 areas')
    .optional(),
  researchInterests: z
    .string()
    .max(2000, 'Research interests must be less than 2000 characters')
    .optional(),
})

export const OnboardingSchema = z.object({
  ...PersonalInfoSchema.shape,
  ...ProfessionalInfoSchema.shape,
  ...InterestsSchema.shape,
})

export type PersonalInfoData = z.infer<typeof PersonalInfoSchema>
export type ProfessionalInfoData = z.infer<typeof ProfessionalInfoSchema>
export type InterestsData = z.infer<typeof InterestsSchema>
export type OnboardingData = z.infer<typeof OnboardingSchema>

export type OnboardingStep = 'personal' | 'professional' | 'interests'

export const stepSchemas: Record<OnboardingStep, z.ZodTypeAny> = {
  personal: PersonalInfoSchema,
  professional: ProfessionalInfoSchema,
  interests: InterestsSchema,
}

export const stepOrder: OnboardingStep[] = [
  'personal',
  'professional',
  'interests',
]
