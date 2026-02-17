'use client'

import { useState, useRef, useEffect } from 'react'
import { useTranslations } from 'next-intl'

interface Suggestion {
  id: string
  name: string
  description?: string
}

interface TagInputProps {
  tags: string[]
  onAdd: (tag: string) => void
  onRemove: (index: number) => void
  suggestions?: Suggestion[]
  label?: string
  description?: string
  placeholder?: string
  inputValue: string
  onInputChange: (value: string) => void
  showSuggestions: boolean
  onShowSuggestionsChange: (show: boolean) => void
}

export function TagInput({
  tags,
  onAdd,
  onRemove,
  suggestions = [],
  label,
  description,
  placeholder,
  inputValue,
  onInputChange,
  showSuggestions,
  onShowSuggestionsChange,
}: TagInputProps) {
  const t = useTranslations()
  const containerRef = useRef<HTMLDivElement>(null)

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        onShowSuggestionsChange(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [onShowSuggestionsChange])

  const handleAdd = () => {
    if (inputValue.trim()) {
      onAdd(inputValue.trim())
      onInputChange('')
      onShowSuggestionsChange(false)
    }
  }

  const filteredSuggestions = suggestions
    .filter((s) => {
      const searchTerm = inputValue.toLowerCase()
      const nameMatch = s.name.toLowerCase().includes(searchTerm)
      const alreadyAdded = tags.includes(s.name)
      return nameMatch && !alreadyAdded
    })
    .slice(0, 5)

  return (
    <div className="space-y-2 relative" ref={containerRef}>
      {label && <label className="text-sm font-medium block">{label}</label>}
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
      <div className="flex gap-2 relative">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder={placeholder}
            value={inputValue}
            onChange={(e) => {
              onInputChange(e.target.value)
              onShowSuggestionsChange(e.target.value.length > 0)
            }}
            onFocus={() => onShowSuggestionsChange(inputValue.length > 0)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                handleAdd()
              }
            }}
            className="flex h-12 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          {showSuggestions &&
            inputValue.length > 0 &&
            filteredSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-input rounded-md shadow-lg max-h-60 overflow-y-auto z-50">
                {filteredSuggestions.map((suggestion) => (
                  <button
                    key={suggestion.id}
                    type="button"
                    onClick={() => {
                      onAdd(suggestion.name)
                      onInputChange('')
                      onShowSuggestionsChange(false)
                    }}
                    className="w-full text-left px-4 py-3 hover:bg-accent transition-colors border-b border-border last:border-b-0"
                  >
                    <div className="font-medium">{suggestion.name}</div>
                    {suggestion.description && (
                      <div className="text-xs text-muted-foreground mt-1">
                        {suggestion.description}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          {showSuggestions &&
            inputValue.length > 0 &&
            filteredSuggestions.length === 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-input rounded-md shadow-lg z-50">
                <div className="px-4 py-3 text-sm text-muted-foreground">
                  {t('Onboarding.Interests.expertiseAreas.noSuggestions')}
                </div>
              </div>
            )}
        </div>
        <button
          type="button"
          onClick={handleAdd}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors h-12"
        >
          +
        </button>
      </div>
      <div className="flex flex-wrap gap-2 mt-2">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="px-3 py-1 border border-input rounded-full text-sm flex items-center gap-1"
          >
            {tag}
            <button
              type="button"
              onClick={() => onRemove(index)}
              className="ml-1 hover:text-destructive"
            >
              ×
            </button>
          </span>
        ))}
      </div>
    </div>
  )
}
