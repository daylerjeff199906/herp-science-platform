'use client'

import { useTranslations } from 'next-intl'
import { Control } from 'react-hook-form'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@repo/ui/components/ui/form'
import { Input } from '@repo/ui/components/ui/input'
import { Textarea } from '@repo/ui/components/ui/textarea'
import type { OnboardingData } from '@/lib/schemas/onboarding'

interface PersonalInfoStepProps {
  control: Control<OnboardingData>
}

export function PersonalInfoStep({ control }: PersonalInfoStepProps) {
  const t = useTranslations()

  return (
    <div className="space-y-6">
      <FormField
        control={control}
        name="birthDate"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-base">
              {t('Onboarding.PersonalInfo.birthDate.label')}
            </FormLabel>
            <FormControl>
              <Input
                type="date"
                placeholder={t('Onboarding.PersonalInfo.birthDate.placeholder')}
                className="h-12"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="location"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-base">
              {t('Onboarding.PersonalInfo.location.label')}
            </FormLabel>
            <FormControl>
              <Input
                placeholder={t('Onboarding.PersonalInfo.location.placeholder')}
                className="h-12"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="phone"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-base">
              {t('Onboarding.PersonalInfo.phone.label')}
            </FormLabel>
            <FormControl>
              <Input
                type="tel"
                placeholder={t('Onboarding.PersonalInfo.phone.placeholder')}
                className="h-12"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}
