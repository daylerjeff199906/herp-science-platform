export type VisibilityStatus = 'public' | 'trusted' | 'private'

export interface Education {
    id: string
    user_id: string
    institution: string
    field_of_study: string
    degree: string
    start_date: string | null
    end_date: string | null
    is_current: boolean
    city: string | null
    region_state: string | null
    country: string | null
    status: 'completed' | 'in_progress' | 'dropped'
    scope: string | null
    visibility: VisibilityStatus
    is_favorite: boolean
    created_at: string
    updated_at: string
}
