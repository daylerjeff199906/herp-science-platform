'use client'

import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Step {
  id: string
  label: string
}

interface StepIndicatorProps {
  steps: Step[]
  currentStep: number
}

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  const t = useTranslations()

  return (
    <div className="w-full mb-8">
      {/* Progress Bar */}
      <div className="relative mb-6">
        <div className="absolute top-1/2 left-0 w-full h-1 bg-muted -translate-y-1/2 rounded-full" />
        <motion.div
          className="absolute top-1/2 left-0 h-1 bg-primary -translate-y-1/2 rounded-full"
          initial={{ width: '0%' }}
          animate={{
            width: `${(currentStep / (steps.length - 1)) * 100}%`,
          }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        />
      </div>

      {/* Steps */}
      <div className="flex justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep
          const isCurrent = index === currentStep
          const isPending = index > currentStep

          return (
            <div key={step.id} className="flex flex-col items-center gap-2">
              <motion.div
                className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors duration-300',
                  isCompleted && 'bg-primary text-primary-foreground',
                  isCurrent &&
                    'bg-primary text-primary-foreground ring-4 ring-primary/20',
                  isPending && 'bg-muted text-muted-foreground'
                )}
                initial={false}
                animate={{
                  scale: isCurrent ? 1.1 : 1,
                }}
                transition={{ duration: 0.3 }}
              >
                {isCompleted ? <Check className="w-5 h-5" /> : index + 1}
              </motion.div>
              <span
                className={cn(
                  'text-xs font-medium transition-colors duration-300',
                  isCompleted && 'text-primary',
                  isCurrent && 'text-primary',
                  isPending && 'text-muted-foreground'
                )}
              >
                {t(step.label)}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
