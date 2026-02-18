'use client'

import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { Check, Leaf, LucideIcon } from 'lucide-react'
import { Loader2 } from 'lucide-react'
import type { Topic } from '@/types/onboarding'
import {
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
} from 'lucide-react'

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

interface TopicSelectorProps {
  topics: Topic[]
  selectedTopics: number[]
  onToggle: (topicId: number) => void
  isLoading?: boolean
  locale: string
}

export function TopicSelector({
  topics,
  selectedTopics,
  onToggle,
  isLoading = false,
  locale,
}: TopicSelectorProps) {
  const t = useTranslations()

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
      {topics.map((topic) => {
        const isSelected = selectedTopics?.includes(topic.id)
        const IconComponent = (topic.icon && iconMap[topic.icon]) || Leaf
        const displayName =
          locale === 'es' && topic.name_es ? topic.name_es : topic.name

        return (
          <motion.button
            key={topic.id}
            type="button"
            onClick={() => onToggle(topic.id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`relative p-4 rounded-xl border-2 transition-all duration-200 text-left ${isSelected
              ? 'border-primary bg-primary/5 shadow-md'
              : 'border-border hover:border-primary/50 hover:bg-accent'
              }`}
            style={{
              backgroundColor: isSelected ? 'rgba(59, 130, 246, 0.05)' : undefined,
              borderColor: isSelected ? topic.color || undefined : undefined,
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
  )
}
