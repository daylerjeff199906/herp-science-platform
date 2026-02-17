export type VisibilityStatus = 'public' | 'trusted' | 'private'

export interface Certification {
    id: string
    user_id: string
    name: string
    issuing_organization: string
    issue_date: string
    expiration_date: string | null
    credential_id: string | null
    credential_url: string | null
    is_favorite: boolean
    visibility: VisibilityStatus
    created_at: string
    updated_at: string
}

export type CertificationInsert = Omit<Certification, 'id' | 'created_at' | 'updated_at'>
export type CertificationUpdate = Partial<CertificationInsert>
