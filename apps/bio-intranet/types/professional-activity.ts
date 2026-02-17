import { VisibilityStatus } from './language'

export type ActivityType = 'distinction' | 'affiliation' | 'service'

export interface ProfessionalActivity {
    id: string
    user_id: string
    organization: string
    city?: string | null
    region_state?: string | null
    country?: string | null
    activity_type: ActivityType | string
    role: string
    start_date: string
    end_date?: string | null
    is_current: boolean
    scope?: string | null
    visibility: VisibilityStatus
    is_favorite?: boolean
    created_at?: string
    updated_at?: string
}
