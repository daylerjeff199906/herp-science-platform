'use client'

import { useTranslations } from 'next-intl'
import type { OnboardingInput } from '@/types/onboarding'

interface PersonalInfoStepProps {
  formData: OnboardingInput
  onChange: (field: keyof OnboardingInput, value: string) => void
}

export function PersonalInfoStep({
  formData,
  onChange,
}: PersonalInfoStepProps) {
  const t = useTranslations()

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium block">
          {t('Onboarding.PersonalInfo.birthDate.label')}
        </label>
        <input
          type="date"
          value={formData.birthDate}
          onChange={(e) => onChange('birthDate', e.target.value)}
          className="flex h-12 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium block">
          {t('Onboarding.PersonalInfo.location.label')}
        </label>
        <input
          type="text"
          placeholder={t('Onboarding.PersonalInfo.location.placeholder')}
          value={formData.location}
          onChange={(e) => onChange('location', e.target.value)}
          className="flex h-12 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium block">
          {t('Onboarding.PersonalInfo.phone.label')}
        </label>
        <input
          type="tel"
          placeholder={t('Onboarding.PersonalInfo.phone.placeholder')}
          value={formData.phone}
          onChange={(e) => onChange('phone', e.target.value)}
          className="flex h-12 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>
    </div>
  )
}
