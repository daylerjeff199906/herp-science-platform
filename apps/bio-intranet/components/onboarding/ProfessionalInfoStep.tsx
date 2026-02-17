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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/ui/components/ui/select'
import type {
  OnboardingData,
  dedicationOptions,
} from '@/lib/schemas/onboarding'

interface ProfessionalInfoStepProps {
  control: Control<OnboardingData>
}

export function ProfessionalInfoStep({ control }: ProfessionalInfoStepProps) {
  const t = useTranslations()

  const dedicationOptionsList: Array<{
    value: (typeof dedicationOptions)[number]
    label: string
  }> = [
      {
        value: 'full_time',
        label: t('Onboarding.ProfessionalInfo.dedication.options.full_time'),
      },
      {
        value: 'part_time',
        label: t('Onboarding.ProfessionalInfo.dedication.options.part_time'),
      },
      {
        value: 'freelance',
        label: t('Onboarding.ProfessionalInfo.dedication.options.freelance'),
      },
      {
        value: 'student',
        label: t('Onboarding.ProfessionalInfo.dedication.options.student'),
      },
      {
        value: 'researcher',
        label: t('Onboarding.ProfessionalInfo.dedication.options.researcher'),
      },
      {
        value: 'professor',
        label: t('Onboarding.ProfessionalInfo.dedication.options.professor'),
      },
      {
        value: 'other',
        label: t('Onboarding.ProfessionalInfo.dedication.options.other'),
      },
    ]

  return (
    <div className="space-y-6">
      <FormField
        control={control}
        name="dedication"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-base">
              {t('Onboarding.ProfessionalInfo.dedication.label')}
            </FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className="h-12">
                  <SelectValue
                    placeholder={t(
                      'Onboarding.ProfessionalInfo.dedication.placeholder'
                    )}
                  />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {dedicationOptionsList.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="institution"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-base">
              {t('Onboarding.ProfessionalInfo.institution.label')}
            </FormLabel>
            <FormControl>
              <Input
                placeholder={t(
                  'Onboarding.ProfessionalInfo.institution.placeholder'
                )}
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
