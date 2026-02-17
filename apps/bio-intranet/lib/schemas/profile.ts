import { z } from 'zod'
import {
    PersonalInfoSchema,
    ProfessionalInfoSchema,
    InterestsSchema,
} from './onboarding'

export const GeneralProfileSchema = z.object({
    firstName: z.string().min(2, 'First name is required'),
    lastName: z.string().min(2, 'Last name is required'),
    email: z.string().optional(),
    bio: z.string().optional(),
    location: z.string().optional(),
    birthDate: z.string().optional(),
    sex: z.enum(['male', 'female', 'other']).optional(),
    phone: z.string().optional(),
    // Extended fields
    dedication: z.string().optional(),
    areasOfInterest: z.array(z.string()),
    expertiseAreas: z.array(z.string()),
    researchInterests: z.string().optional(),
    institution: z.string().optional(),
    onboardingCompleted: z.boolean().optional(),
})

export type GeneralProfileData = z.infer<typeof GeneralProfileSchema>

export const AcademicProfileSchema = z.object({
    ...ProfessionalInfoSchema.shape,
    currentPosition: z.string().optional(),
    website: z.string().optional(),
    ...InterestsSchema.shape,
})

export type AcademicProfileData = z.infer<typeof AcademicProfileSchema>

export const SecurityProfileSchema = z.object({
    currentPassword: z.string().optional(),
    newPassword: z.string().min(6, 'Password must be at least 6 characters').optional(),
    confirmPassword: z.string().optional(),
}).refine((data) => {
    if (data.newPassword && !data.currentPassword) {
        return false // Current password required to change
    }
    if (data.newPassword !== data.confirmPassword) {
        return false
    }
    return true
}, {
    message: "Passwords do not match or current password missing",
    path: ["confirmPassword"],
})

export type SecurityProfileData = z.infer<typeof SecurityProfileSchema>
