'use client'

import { useTranslations } from 'next-intl'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/ui/components/ui/select'
import type { OnboardingInput } from '@/types/onboarding'

interface ProfessionalInfoStepProps {
  formData: OnboardingInput
  onChange: (field: keyof OnboardingInput, value: string | undefined) => void
}

const dedicationOptions = [
  { value: 'full_time', label: 'full_time' },
  { value: 'part_time', label: 'part_time' },
  { value: 'freelance', label: 'freelance' },
  { value: 'student', label: 'student' },
  { value: 'researcher', label: 'researcher' },
  { value: 'professor', label: 'professor' },
  { value: 'other', label: 'other' },
]

export function ProfessionalInfoStep({
  formData,
  onChange,
}: ProfessionalInfoStepProps) {
  const t = useTranslations()

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium block">
          {t('Onboarding.ProfessionalInfo.dedication.label')}
        </label>
        <Select
          value={formData.dedication || ''}
          onValueChange={(value) => onChange('dedication', value || undefined)}
        >
          <SelectTrigger className="h-12">
            <SelectValue
              placeholder={t(
                'Onboarding.ProfessionalInfo.dedication.placeholder'
              )}
            />
          </SelectTrigger>
          <SelectContent>
            {dedicationOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {t(
                  `Onboarding.ProfessionalInfo.dedication.options.${opt.label}`
                )}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium block">
          {t('Onboarding.ProfessionalInfo.institution.label')}
        </label>
        <input
          type="text"
          placeholder={t('Onboarding.ProfessionalInfo.institution.placeholder')}
          value={formData.institution}
          onChange={(e) => onChange('institution', e.target.value)}
          className="flex h-12 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>
    </div>
  )
}
