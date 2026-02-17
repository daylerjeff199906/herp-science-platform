export type EducationStatus = 'in_progress' | 'completed' | 'dropped'
export type VisibilityStatus = 'public' | 'trusted' | 'private'

export interface Education {
    id: string
    user_id: string
    institution: string
    city: string | null
    region_state: string | null
    country: string | null
    title: string
    field_of_study: string | null
    status: EducationStatus
    start_date: string | null
    end_date: string | null
    is_current: boolean
    scope: string | null
    visibility: VisibilityStatus
    degree: string | null
    created_at: string
    updated_at: string
}

export type EducationInsert = Omit<Education, 'id' | 'created_at' | 'updated_at'>
export type EducationUpdate = Partial<EducationInsert>
