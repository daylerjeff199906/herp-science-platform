import { z } from 'zod'

export const certificationSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(1, 'required'),
    issuing_organization: z.string().min(1, 'required'),
    issue_date: z.string().min(1, 'required'),
    expiration_date: z.string().optional().nullable(),
    credential_id: z.string().optional().nullable(),
    credential_url: z.string().url('invalid_url').optional().nullable().or(z.literal('')),
    visibility: z.enum(['public', 'trusted', 'private']).default('public'),
    is_favorite: z.boolean().default(false),
}).refine((data) => {
    if (data.expiration_date && data.issue_date) {
        return new Date(data.expiration_date) >= new Date(data.issue_date)
    }
    return true
}, {
    message: "endDateError",
    path: ["expiration_date"],
})

export type CertificationFormValues = z.infer<typeof certificationSchema>
