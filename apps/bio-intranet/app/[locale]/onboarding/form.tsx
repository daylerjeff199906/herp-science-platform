'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { Alert, AlertDescription } from '@repo/ui/components/ui/alert'
import { Button } from '@repo/ui/components/ui/button'
import { AlertCircle, Loader2, Leaf, ArrowRight } from 'lucide-react'
import {
  submitOnboarding,
  getActiveTopics,
  getInterestCategories,
} from './actions'
import type {
  Topic,
  OnboardingInput,
  InterestCategory,
} from '@/types/onboarding'
import {
  PersonalInfoStep,
  ProfessionalInfoStep,
  InterestsStep,
} from '@/components/onboarding/steps'

interface OnboardingFormProps {
  locale: string
}

const steps = [
  { id: 'personal', label: 'Onboarding.Steps.personal' },
  { id: 'professional', label: 'Onboarding.Steps.professional' },
  { id: 'interests', label: 'Onboarding.Steps.interests' },
]

export default function OnboardingForm({ locale }: OnboardingFormProps) {
  const t = useTranslations()
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [topics, setTopics] = useState<Topic[]>([])
  const [isLoadingTopics, setIsLoadingTopics] = useState(true)
  const [interestCategories, setInterestCategories] = useState<
    InterestCategory[]
  >([])
  const [formData, setFormData] = useState<OnboardingInput>({
    birthDate: '',
    location: '',
    phone: '',
    bio: '',
    dedication: undefined,
    institution: '',
    selectedTopics: [],
    expertiseAreas: [],
    researchInterests: '',
  })

  useEffect(() => {
    async function loadData() {
      const [topicsData, categoriesData] = await Promise.all([
        getActiveTopics(locale),
        getInterestCategories(locale),
      ])
      setTopics(topicsData)
      setInterestCategories(categoriesData)
      setIsLoadingTopics(false)
    }
    loadData()
  }, [locale])

  const handleChange = (field: keyof OnboardingInput, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleNext = () => {
    if (currentStep === 0 && !formData.birthDate) {
      setError(t('Onboarding.Errors.birthDateRequired'))
      return
    }
    if (
      currentStep === 2 &&
      (!formData.selectedTopics || formData.selectedTopics.length === 0)
    ) {
      setError(t('Onboarding.Errors.topicsRequired'))
      return
    }
    setError(null)
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const handleBack = () => {
    setError(null)
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    setError(null)

    try {
      await submitOnboarding(formData, locale)
    } catch (err) {
      setError(t('Onboarding.Errors.saveError'))
      setIsSubmitting(false)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <PersonalInfoStep formData={formData} onChange={handleChange} />
      case 1:
        return (
          <ProfessionalInfoStep formData={formData} onChange={handleChange} />
        )
      case 2:
        return (
          <InterestsStep
            formData={formData}
            onChange={handleChange}
            topics={topics}
            interestCategories={interestCategories}
            isLoadingTopics={isLoadingTopics}
            locale={locale}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="w-full">
      {/* Header con Logo */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
          <Leaf className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight mb-2">
          {t('Onboarding.title')}
        </h1>
        <p className="text-muted-foreground">{t('Onboarding.description')}</p>
      </div>
      {/* Form */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {renderStep()}
        </motion.div>
      </AnimatePresence>

      {/* Error */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6"
        >
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </motion.div>
      )}

      {/* Buttons */}
      <div className="flex flex-col gap-2 mt-8">
        {currentStep === steps.length - 1 ? (
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="h-12 px-8 rounded-full"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('Onboarding.saving')}
              </>
            ) : (
              t('Onboarding.finish')
            )}
          </Button>
        ) : (
          <Button
            type="button"
            onClick={handleNext}
            disabled={isSubmitting}
            className="h-12 px-8 rounded-full"
          >
            {t('Onboarding.next')} <ArrowRight className="h-4 w-4" />
          </Button>
        )}
        <Button
          type="button"
          variant="link"
          onClick={handleBack}
          disabled={currentStep === 0 || isSubmitting}
          className="h-12 px-6 rounded-full"
        >
          {t('Onboarding.back')}
        </Button>
      </div>
    </div>
  )
}
