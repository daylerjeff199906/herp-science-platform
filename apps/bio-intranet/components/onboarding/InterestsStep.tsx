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
import { Textarea } from '@repo/ui/components/ui/textarea'
import { Badge } from '@repo/ui/components/ui/badge'
import { Input } from '@repo/ui/components/ui/input'
import { X } from 'lucide-react'
import { useState } from 'react'
import type { OnboardingData } from '@/lib/schemas/onboarding'

interface InterestsStepProps {
  control: Control<OnboardingData>
}

export function InterestsStep({ control }: InterestsStepProps) {
  const t = useTranslations()
  const [interestInput, setInterestInput] = useState('')
  const [expertiseInput, setExpertiseInput] = useState('')

  return (
    <div className="space-y-6">
      <FormField
        control={control}
        name="areasOfInterest"
        render={({ field }) => {
          const areas = field.value || []

          const addInterest = () => {
            if (interestInput.trim() && !areas.includes(interestInput.trim())) {
              field.onChange([...areas, interestInput.trim()])
              setInterestInput('')
            }
          }

          const removeInterest = (index: number) => {
            field.onChange(areas.filter((_, i) => i !== index))
          }

          return (
            <FormItem>
              <FormLabel className="text-base">
                {t('Onboarding.Interests.areasOfInterest.label')}
              </FormLabel>
              <p className="text-sm text-muted-foreground mb-3">
                {t('Onboarding.Interests.areasOfInterest.description')}
              </p>
              <FormControl>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Input
                      placeholder={t(
                        'Onboarding.Interests.areasOfInterest.placeholder'
                      )}
                      className="h-12"
                      value={interestInput}
                      onChange={(e) => setInterestInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          addInterest()
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={addInterest}
                      className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                    >
                      +
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {areas.map((area, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="px-3 py-1 text-sm flex items-center gap-1"
                      >
                        {area}
                        <button
                          type="button"
                          onClick={() => removeInterest(index)}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )
        }}
      />

      <FormField
        control={control}
        name="expertiseAreas"
        render={({ field }) => {
          const areas = field.value || []

          const addExpertise = () => {
            if (
              expertiseInput.trim() &&
              !areas.includes(expertiseInput.trim())
            ) {
              field.onChange([...areas, expertiseInput.trim()])
              setExpertiseInput('')
            }
          }

          const removeExpertise = (index: number) => {
            field.onChange(areas.filter((_, i) => i !== index))
          }

          return (
            <FormItem>
              <FormLabel className="text-base">
                {t('Onboarding.Interests.expertiseAreas.label')}
              </FormLabel>
              <p className="text-sm text-muted-foreground mb-3">
                {t('Onboarding.Interests.expertiseAreas.description')}
              </p>
              <FormControl>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Input
                      placeholder={t(
                        'Onboarding.Interests.expertiseAreas.placeholder'
                      )}
                      className="h-12"
                      value={expertiseInput}
                      onChange={(e) => setExpertiseInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          addExpertise()
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={addExpertise}
                      className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                    >
                      +
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {areas.map((area, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="px-3 py-1 text-sm flex items-center gap-1"
                      >
                        {area}
                        <button
                          type="button"
                          onClick={() => removeExpertise(index)}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )
        }}
      />

      <FormField
        control={control}
        name="researchInterests"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-base">
              {t('Onboarding.Interests.researchInterests.label')}
            </FormLabel>
            <FormControl>
              <Textarea
                placeholder={t(
                  'Onboarding.Interests.researchInterests.placeholder'
                )}
                className="min-h-[150px] resize-none"
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
