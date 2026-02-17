import { z } from 'zod'

export const employmentSchema = z
    .object({
        id: z.string().optional(),
        organization: z.string().min(1, 'La organización es requerida'),
        role: z.string().min(1, 'El cargo es requerido'),
        department: z.string().optional(),
        city: z.string().optional(),
        region_state: z.string().optional(),
        country: z.string().optional(),
        start_date: z.string().min(1, 'La fecha de inicio es requerida'),
        end_date: z.string().optional(),
        is_current: z.boolean(),
        scope: z.string().optional(),
        visibility: z.enum(['public', 'trusted', 'private']),
    })
    .refine(
        (data) => {
            // If strictly enforcing that past jobs have end dates:
            // The DB constraint says: (is_current = true) OR (end_date IS NOT NULL)
            if (!data.is_current && !data.end_date) {
                return false
            }
            return true
        },
        {
            message: 'La fecha de fin es requerida si no es el trabajo actual',
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

export type EmploymentFormValues = z.infer<typeof employmentSchema>
