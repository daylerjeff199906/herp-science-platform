export type VisibilityStatus = 'public' | 'trusted' | 'private'

export interface Employment {
    id: string
    user_id: string
    organization: string
    city: string | null
    region_state: string | null
    country: string | null
    department: string | null
    role: string
    start_date: string
    end_date: string | null
    is_current: boolean
    scope: string | null
    visibility: VisibilityStatus
    created_at: string
    updated_at: string
}

export type EmploymentInsert = Omit<Employment, 'id' | 'created_at' | 'updated_at'>
export type EmploymentUpdate = Partial<EmploymentInsert>
