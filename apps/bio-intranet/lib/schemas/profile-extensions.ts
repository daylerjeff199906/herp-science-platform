import { z } from 'zod'

export const SocialLinkSchema = z.object({
    id: z.string(),
    title: z.string().min(1, 'Title is required'),
    url: z.string().url('Invalid URL'),
    visibility: z.enum(['public', 'trusted', 'private']).default('public'),
    order: z.number().optional().default(0)
})

export const AdditionalEmailSchema = z.object({
    id: z.string(),
    email: z.string().email('Invalid email'),
    visibility: z.enum(['public', 'trusted', 'private']).default('private'),
    is_verified: z.boolean().default(false).optional()
})

export type SocialLink = z.infer<typeof SocialLinkSchema>
export type AdditionalEmail = z.infer<typeof AdditionalEmailSchema>
