export interface Topic {
  id: number
  name: string
  name_es: string | null
  description: string | null
  description_es: string | null
  image: string | null
  color: string | null
  icon: string | null
  isActived: boolean
}

export interface OnboardingInput {
  birthDate: string
  location?: string
  phone?: string
  bio?: string
  dedication?:
    | 'full_time'
    | 'part_time'
    | 'freelance'
    | 'student'
    | 'researcher'
    | 'professor'
    | 'other'
  currentPosition?: string
  institution?: string
  website?: string
  selectedTopics: number[]
  expertiseAreas: string[]
  researchInterests?: string
}

export interface InterestCategory {
  id: string
  name: string
  name_es: string | null
  description: string | null
  description_es: string | null
}
