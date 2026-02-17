import { z } from 'zod'

export const educationSchema = z
    .object({
        id: z.string().optional(),
        institution: z.string().min(1, 'La institución es requerida'),
        city: z.string().optional(),
        region_state: z.string().optional(),
        country: z.string().optional(),
        title: z.string().min(1, 'El título es requerido'),
        field_of_study: z.string().optional(),
        status: z.enum(['completed', 'in_progress', 'dropped']),
        start_date: z.string().min(1, 'La fecha de inicio es requerida'),
        end_date: z.string().optional(),
        is_current: z.boolean(),
        scope: z.string().optional(),
        visibility: z.enum(['public', 'trusted', 'private']),
        degree: z.string().optional(),
    })
    .refine(
        (data) => {
            // If it's completed, it must have an end date
            if (
                data.status === 'completed' &&
                !data.is_current &&
                !data.end_date
            ) {
                return false
            }
            return true
        },
        {
            message: 'La fecha de fin es requerida si el estudio está completado',
            path: ['end_date'],
        }
    )
    .refine(
        (data) => {
            // End date must be after start date
            if (data.end_date && data.start_date) {
                return new Date(data.end_date) >= new Date(data.start_date)
            }
            return true
        },
        {
            message: 'La fecha de fin debe ser posterior a la fecha de inicio',
            path: ['end_date'],
        }
    )

export type EducationFormValues = z.infer<typeof educationSchema>
