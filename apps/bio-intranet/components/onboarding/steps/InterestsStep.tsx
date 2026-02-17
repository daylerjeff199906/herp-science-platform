'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { TopicSelector } from '../TopicSelector'
import { TagInput } from '../TagInput'
import type {
  OnboardingInput,
  Topic,
  InterestCategory,
} from '@/types/onboarding'

interface InterestsStepProps {
  formData: OnboardingInput
  onChange: (field: keyof OnboardingInput, value: unknown) => void
  topics: Topic[]
  interestCategories: InterestCategory[]
  isLoadingTopics: boolean
  locale: string
}

export function InterestsStep({
  formData,
  onChange,
  topics,
  interestCategories,
  isLoadingTopics,
  locale,
}: InterestsStepProps) {
  const t = useTranslations()
  const [expertiseInput, setExpertiseInput] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)

  const toggleTopic = (topicId: number) => {
    const current = formData.selectedTopics || []
    if (current.includes(topicId)) {
      onChange(
        'selectedTopics',
        current.filter((id) => id !== topicId)
      )
    } else {
      onChange('selectedTopics', [...current, topicId])
    }
  }

  const addExpertise = (expertise: string) => {
    const current = formData.expertiseAreas || []
    if (expertise.trim() && !current.includes(expertise.trim())) {
      onChange('expertiseAreas', [...current, expertise.trim()])
    }
  }

  const removeExpertise = (index: number) => {
    const current = formData.expertiseAreas || []
    onChange(
      'expertiseAreas',
      current.filter((_, i) => i !== index)
    )
  }

  // Transform interest categories to suggestions format
  const suggestions = interestCategories.map((cat) => ({
    id: cat.id,
    name: locale === 'es' && cat.name_es ? cat.name_es : cat.name,
    description:
      locale === 'es' && cat.description_es
        ? cat.description_es
        : cat.description || undefined,
  }))

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

          <TopicSelector
            topics={topics}
            selectedTopics={formData.selectedTopics}
            onToggle={toggleTopic}
            isLoading={isLoadingTopics}
            locale={locale}
          />

          {formData.selectedTopics && formData.selectedTopics.length > 0 && (
            <p className="text-sm text-muted-foreground mt-3">
              {t('Onboarding.Interests.topics.selected', {
                count: formData.selectedTopics.length,
              })}
            </p>
          )}
        </div>
      </div>

      <TagInput
        tags={formData.expertiseAreas || []}
        onAdd={addExpertise}
        onRemove={removeExpertise}
        suggestions={suggestions}
        label={t('Onboarding.Interests.expertiseAreas.label')}
        description={t('Onboarding.Interests.expertiseAreas.description')}
        placeholder={t('Onboarding.Interests.expertiseAreas.placeholder')}
        inputValue={expertiseInput}
        onInputChange={setExpertiseInput}
        showSuggestions={showSuggestions}
        onShowSuggestionsChange={setShowSuggestions}
      />

      <div className="space-y-2">
        <label className="text-sm font-medium block">
          {t('Onboarding.Interests.researchInterests.label')}
        </label>
        <textarea
          placeholder={t('Onboarding.Interests.researchInterests.placeholder')}
          value={formData.researchInterests}
          onChange={(e) => onChange('researchInterests', e.target.value)}
          rows={5}
          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
        />
      </div>
    </div>
  )
}
