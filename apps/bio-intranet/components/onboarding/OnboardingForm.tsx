'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { Form } from '@repo/ui/components/ui/form'
import { Button } from '@repo/ui/components/ui/button'
import { Alert, AlertDescription } from '@repo/ui/components/ui/alert'
import { AlertCircle, Loader2 } from 'lucide-react'
import { StepIndicator } from './StepIndicator'
import { PersonalInfoStep } from './PersonalInfoStep'
import { ProfessionalInfoStep } from './ProfessionalInfoStep'
import { InterestsStep } from './InterestsStep'
import {
  OnboardingSchema,
  stepOrder,
  stepSchemas,
} from '@/lib/schemas/onboarding'
import type {
  OnboardingData,
  OnboardingStep as StepType,
} from '@/lib/schemas/onboarding'
import { submitOnboarding } from '@/app/[locale]/onboarding/actions'

const fadeVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
}

export function OnboardingForm() {
  const t = useTranslations()
  const router = useRouter()
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const currentStep: StepType = stepOrder[currentStepIndex]

  const form = useForm<OnboardingData>({
    resolver: zodResolver(OnboardingSchema),
    defaultValues: {
      birthDate: '',
      location: '',
      phone: '',
      bio: '',
      dedication: undefined,
      currentPosition: '',
      institution: '',
      website: '',
      areasOfInterest: [],
      expertiseAreas: [],
      researchInterests: '',
    },
    mode: 'onChange',
  })

  const validateCurrentStep = async (): Promise<boolean> => {
    const stepSchema = stepSchemas[currentStep]
    const fields = Object.keys(stepSchema.shape) as Array<keyof OnboardingData>
    return await form.trigger(fields)
  }

  const handleNext = async () => {
    const isValid = await validateCurrentStep()
    if (!isValid) return

    if (currentStepIndex < stepOrder.length - 1) {
      setCurrentStepIndex((prev) => prev + 1)
    }
  }

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1)
    }
  }

  const onSubmit = async (data: OnboardingData) => {
    setIsSubmitting(true)
    setError(null)

    try {
      const result = await submitOnboarding(data)

      if (result?.error) {
        setError(result.error)
        setIsSubmitting(false)
        return
      }

      if (result?.success) {
        router.push('/dashboard?welcome=true')
        router.refresh()
      }
    } catch (err) {
      setError(t('Onboarding.Errors.saveError'))
      setIsSubmitting(false)
    }
  }

  const renderStepContent = (step: StepType) => {
    switch (step) {
      case 'personal':
        return <PersonalInfoStep control={form.control} />
      case 'professional':
        return <ProfessionalInfoStep control={form.control} />
      case 'interests':
        return <InterestsStep control={form.control} />
      default:
        return null
    }
  }

  const isLastStep = currentStepIndex === stepOrder.length - 1

  return (
    <div className="w-full max-w-2xl mx-auto">
      <StepIndicator steps={stepOrder} currentStep={currentStepIndex} />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              variants={fadeVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{
                duration: 0.3,
                ease: 'easeInOut',
              }}
              className="min-h-[400px]"
            >
              {renderStepContent(currentStep)}
            </motion.div>
          </AnimatePresence>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </motion.div>
          )}

          <motion.div
            className="flex justify-between pt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              disabled={currentStepIndex === 0 || isSubmitting}
              className="h-12 px-6"
            >
              {t('Onboarding.back')}
            </Button>

            {isLastStep ? (
              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-12 px-8"
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
                className="h-12 px-8"
              >
                {t('Onboarding.next')}
              </Button>
            )}
          </motion.div>
        </form>
      </Form>
    </div>
  )
}
