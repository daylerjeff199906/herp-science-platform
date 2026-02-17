export type LanguageLevel = 'basic' | 'intermediate' | 'advanced' | 'native' | 'fluent'
export type VisibilityStatus = 'public' | 'trusted' | 'private'

export interface Language {
    id: string
    user_id: string
    language: string
    level: LanguageLevel
    is_native: boolean
    visibility: VisibilityStatus
    created_at: string
    updated_at: string
    is_favorite?: boolean
}
