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
  sex?: 'male' | 'female' | 'other'
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
  institution?: string
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
