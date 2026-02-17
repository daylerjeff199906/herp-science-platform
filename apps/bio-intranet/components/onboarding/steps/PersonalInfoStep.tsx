'use client'

import { useTranslations } from 'next-intl'
import type { OnboardingInput } from '@/types/onboarding'
import { PhoneInput } from '@/components/ui/phone-input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/ui/components/ui/select'
import { Input } from '@repo/ui/components/ui/input'
import { Label } from '@repo/ui/components/ui/label'

interface PersonalInfoStepProps {
  formData: OnboardingInput
  onChange: (field: keyof OnboardingInput, value: any) => void
}

export function PersonalInfoStep({
  formData,
  onChange,
}: PersonalInfoStepProps) {
  const t = useTranslations()

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>
          {t('Onboarding.PersonalInfo.birthDate.label')}
        </Label>
        <Input
          type="date"
          value={formData.birthDate || ''}
          onChange={(e) => onChange('birthDate', e.target.value)}
          className="h-12"
        />
      </div>

      <div className="space-y-2">
        <Label>
          {t('Onboarding.PersonalInfo.sex.label')}
        </Label>
        <Select
          value={formData.sex}
          onValueChange={(val) => onChange('sex', val)}
        >
          <SelectTrigger className="h-12">
            <SelectValue placeholder={t('Onboarding.PersonalInfo.sex.placeholder')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="male">{t('Onboarding.PersonalInfo.sex.options.male')}</SelectItem>
            <SelectItem value="female">{t('Onboarding.PersonalInfo.sex.options.female')}</SelectItem>
            <SelectItem value="other">{t('Onboarding.PersonalInfo.sex.options.other')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>
          {t('Onboarding.PersonalInfo.location.label')}
        </Label>
        <Input
          type="text"
          placeholder={t('Onboarding.PersonalInfo.location.placeholder')}
          value={formData.location || ''}
          onChange={(e) => onChange('location', e.target.value)}
          className="h-12"
        />
      </div>

      <div className="space-y-2">
        <Label>
          {t('Onboarding.PersonalInfo.phone.label')}
        </Label>
        <PhoneInput
          value={formData.phone || ''}
          onChange={(val) => onChange('phone', val)}
          defaultCountry="PE"
        />
      </div>
    </div>
  )
}
