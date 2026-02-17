import { z } from 'zod'

export const professionalActivitySchema = z.object({
    id: z.string().optional(),
    organization: z.string().min(1, { message: 'Organization is required' }),
    activity_type: z.string().min(1, { message: 'Activity type is required' }),
    role: z.string().min(1, { message: 'Role is required' }),
    city: z.string().optional(),
    region_state: z.string().optional(),
    country: z.string().optional(),
    start_date: z.string().min(1, { message: 'Start date is required' }),
    end_date: z.string().optional().nullable(),
    is_current: z.boolean().default(false),
    scope: z.string().optional(),
    visibility: z.enum(['public', 'trusted', 'private']).default('public'),
    is_favorite: z.boolean().optional(),
}).refine((data) => {
    if (data.is_current) return true
    if (!data.end_date) return false
    return new Date(data.end_date) >= new Date(data.start_date)
}, {
    message: "End date must be after start date",
    path: ["end_date"],
})

export type ProfessionalActivityFormValues = z.infer<typeof professionalActivitySchema>
