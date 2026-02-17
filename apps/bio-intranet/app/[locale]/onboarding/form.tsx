'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { Alert, AlertDescription } from '@repo/ui/components/ui/alert'
import { Button } from '@repo/ui/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/ui/components/ui/select'
import {
  AlertCircle,
  Loader2,
  Check,
  Leaf,
  Trees,
  Dna,
  GitBranch,
  ListTree,
  ThermometerSun,
  Waves,
  Microscope,
  Sprout,
  PawPrint,
  Bird,
  Bug,
  FlaskConical,
  Skull,
  Binary,
  Users,
  Activity,
  RefreshCw,
  LucideIcon,
  ArrowRight,
} from 'lucide-react'
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

interface OnboardingFormProps {
  locale: string
}

const steps = ['personal', 'professional', 'interests'] as const

const dedicationOptions = [
  { value: 'full_time', label: 'full_time' },
  { value: 'part_time', label: 'part_time' },
  { value: 'freelance', label: 'freelance' },
  { value: 'student', label: 'student' },
  { value: 'researcher', label: 'researcher' },
  { value: 'professor', label: 'professor' },
  { value: 'other', label: 'other' },
]

const iconMap: Record<string, LucideIcon> = {
  leaf: Leaf,
  trees: Trees,
  dna: Dna,
  'git-branch': GitBranch,
  'list-tree': ListTree,
  'thermometer-sun': ThermometerSun,
  waves: Waves,
  microscope: Microscope,
  sprout: Sprout,
  'paw-print': PawPrint,
  snake: Activity,
  bird: Bird,
  bug: Bug,
  mushroom: Sprout,
  'flask-conical': FlaskConical,
  skull: Skull,
  binary: Binary,
  users: Users,
  activity: Activity,
  'refresh-cw': RefreshCw,
}

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
  const [expertiseInput, setExpertiseInput] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [formData, setFormData] = useState<OnboardingInput>({
    birthDate: '',
    location: '',
    phone: '',
    bio: '',
    dedication: undefined,
    currentPosition: '',
    institution: '',
    website: '',
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

  const handleChange = (field: keyof OnboardingInput, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const toggleTopic = (topicId: number) => {
    setFormData((prev) => {
      const current = prev.selectedTopics || []
      if (current.includes(topicId)) {
        return {
          ...prev,
          selectedTopics: current.filter((id) => id !== topicId),
        }
      } else {
        return { ...prev, selectedTopics: [...current, topicId] }
      }
    })
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

  const addExpertise = (expertise: string) => {
    const current = formData.expertiseAreas || []
    if (expertise.trim() && !current.includes(expertise.trim())) {
      handleChange('expertiseAreas', [...current, expertise.trim()])
    }
  }

  const removeExpertise = (index: number) => {
    const current = formData.expertiseAreas || []
    handleChange(
      'expertiseAreas',
      current.filter((_, i) => i !== index)
    )
  }

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium block">
                {t('Onboarding.PersonalInfo.birthDate.label')}
              </label>
              <input
                type="date"
                value={formData.birthDate}
                onChange={(e) => handleChange('birthDate', e.target.value)}
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
                onChange={(e) => handleChange('location', e.target.value)}
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
                onChange={(e) => handleChange('phone', e.target.value)}
                className="flex h-12 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
          </div>
        )
      case 1:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium block">
                {t('Onboarding.ProfessionalInfo.dedication.label')}
              </label>
              <Select
                value={formData.dedication || ''}
                onValueChange={(value) =>
                  handleChange('dedication', value || undefined)
                }
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
                placeholder={t(
                  'Onboarding.ProfessionalInfo.institution.placeholder'
                )}
                value={formData.institution}
                onChange={(e) => handleChange('institution', e.target.value)}
                className="flex h-12 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium block">
                {t('Onboarding.ProfessionalInfo.website.label')}
              </label>
              <input
                type="url"
                placeholder={t(
                  'Onboarding.ProfessionalInfo.website.placeholder'
                )}
                value={formData.website}
                onChange={(e) => handleChange('website', e.target.value)}
                className="flex h-12 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
          </div>
        )
      case 2:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium block mb-2">
                  {t('Onboarding.Interests.topics.label')}
                </label>
                <p className="text-sm text-muted-foreground mb-4">
                  {t('Onboarding.Interests.topics.description')}
                </p>

                {isLoadingTopics ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {topics.map((topic) => {
                      const isSelected = formData.selectedTopics?.includes(
                        topic.id
                      )
                      const IconComponent =
                        (topic.icon && iconMap[topic.icon]) || Leaf
                      const displayName =
                        locale === 'es' && topic.name_es
                          ? topic.name_es
                          : topic.name
                      const displayDescription =
                        locale === 'es' && topic.description_es
                          ? topic.description_es
                          : topic.description

                      return (
                        <motion.button
                          key={topic.id}
                          type="button"
                          onClick={() => toggleTopic(topic.id)}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={`relative p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                            isSelected
                              ? 'border-primary bg-primary/5 shadow-md'
                              : 'border-border hover:border-primary/50 hover:bg-accent'
                          }`}
                          style={{
                            borderColor: isSelected
                              ? topic.color || undefined
                              : undefined,
                          }}
                        >
                          <div className="flex flex-col items-center text-center gap-2">
                            <div
                              className="w-10 h-10 rounded-lg flex items-center justify-center"
                              style={{
                                backgroundColor: topic.color || '#3b82f6',
                              }}
                            >
                              <IconComponent className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xs font-medium line-clamp-2">
                              {displayName}
                            </span>
                          </div>
                          {isSelected && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute top-1 right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center"
                            >
                              <Check className="w-3 h-3 text-primary-foreground" />
                            </motion.div>
                          )}
                        </motion.button>
                      )
                    })}
                  </div>
                )}

                {formData.selectedTopics &&
                  formData.selectedTopics.length > 0 && (
                    <p className="text-sm text-muted-foreground mt-3">
                      {t('Onboarding.Interests.topics.selected', {
                        count: formData.selectedTopics.length,
                      })}
                    </p>
                  )}
              </div>
            </div>

            <div className="space-y-2 relative">
              <label className="text-sm font-medium block">
                {t('Onboarding.Interests.expertiseAreas.label')}
              </label>
              <p className="text-sm text-muted-foreground">
                {t('Onboarding.Interests.expertiseAreas.description')}
              </p>
              <div className="flex gap-2 relative">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder={t(
                      'Onboarding.Interests.expertiseAreas.placeholder'
                    )}
                    value={expertiseInput}
                    onChange={(e) => {
                      setExpertiseInput(e.target.value)
                      setShowSuggestions(e.target.value.length > 0)
                    }}
                    onFocus={() =>
                      setShowSuggestions(expertiseInput.length > 0)
                    }
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        if (expertiseInput.trim()) {
                          addExpertise(expertiseInput)
                          setExpertiseInput('')
                          setShowSuggestions(false)
                        }
                      }
                    }}
                    className="flex h-12 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                  {showSuggestions && expertiseInput.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-input rounded-md shadow-lg max-h-60 overflow-y-auto z-50">
                      {interestCategories
                        .filter((cat) => {
                          const searchTerm = expertiseInput.toLowerCase()
                          const nameMatch = cat.name
                            .toLowerCase()
                            .includes(searchTerm)
                          const nameEsMatch = cat.name_es
                            ?.toLowerCase()
                            .includes(searchTerm)
                          const alreadyAdded =
                            formData.expertiseAreas?.includes(
                              locale === 'es' && cat.name_es
                                ? cat.name_es
                                : cat.name
                            )
                          return (nameMatch || nameEsMatch) && !alreadyAdded
                        })
                        .slice(0, 5)
                        .map((cat) => (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => {
                              const displayName =
                                locale === 'es' && cat.name_es
                                  ? cat.name_es
                                  : cat.name
                              addExpertise(displayName)
                              setExpertiseInput('')
                              setShowSuggestions(false)
                            }}
                            className="w-full text-left px-4 py-3 hover:bg-accent transition-colors border-b border-border last:border-b-0"
                          >
                            <div className="font-medium">
                              {locale === 'es' && cat.name_es
                                ? cat.name_es
                                : cat.name}
                            </div>
                            {cat.description && (
                              <div className="text-xs text-muted-foreground mt-1">
                                {locale === 'es' && cat.description_es
                                  ? cat.description_es
                                  : cat.description}
                              </div>
                            )}
                          </button>
                        ))}
                      {interestCategories.filter((cat) => {
                        const searchTerm = expertiseInput.toLowerCase()
                        const nameMatch = cat.name
                          .toLowerCase()
                          .includes(searchTerm)
                        const nameEsMatch = cat.name_es
                          ?.toLowerCase()
                          .includes(searchTerm)
                        const alreadyAdded = formData.expertiseAreas?.includes(
                          locale === 'es' && cat.name_es
                            ? cat.name_es
                            : cat.name
                        )
                        return (nameMatch || nameEsMatch) && !alreadyAdded
                      }).length === 0 && (
                        <div className="px-4 py-3 text-sm text-muted-foreground">
                          {t(
                            'Onboarding.Interests.expertiseAreas.noSuggestions'
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (expertiseInput.trim()) {
                      addExpertise(expertiseInput)
                      setExpertiseInput('')
                      setShowSuggestions(false)
                    }
                  }}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors h-12"
                >
                  +
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.expertiseAreas?.map((area, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 border border-input rounded-full text-sm flex items-center gap-1"
                  >
                    {area}
                    <button
                      type="button"
                      onClick={() => removeExpertise(index)}
                      className="ml-1 hover:text-destructive"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium block">
                {t('Onboarding.Interests.researchInterests.label')}
              </label>
              <textarea
                placeholder={t(
                  'Onboarding.Interests.researchInterests.placeholder'
                )}
                value={formData.researchInterests}
                onChange={(e) =>
                  handleChange('researchInterests', e.target.value)
                }
                rows={5}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
              />
            </div>
          </div>
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

      {/* Progress */}
      <div className="mb-8">
        <div className="flex justify-between mb-4">
          {steps.map((step, index) => (
            <div key={step} className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                  index < currentStep
                    ? 'bg-primary text-primary-foreground'
                    : index === currentStep
                      ? 'bg-primary text-primary-foreground ring-4 ring-primary/20'
                      : 'bg-muted text-muted-foreground'
                }`}
              >
                {index < currentStep ? (
                  <Check className="w-5 h-5" />
                ) : (
                  index + 1
                )}
              </div>
              <span
                className={`text-xs mt-2 font-medium ${
                  index <= currentStep
                    ? 'text-primary'
                    : 'text-muted-foreground'
                }`}
              >
                {t(`Onboarding.Steps.${step}`)}
              </span>
            </div>
          ))}
        </div>
        <div className="relative h-1 bg-muted rounded-full">
          <motion.div
            className="absolute h-full bg-primary rounded-full"
            initial={{ width: '0%' }}
            animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
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
