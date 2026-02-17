'use server'

import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { sendWelcomeEmail } from '@/lib/email'
import type { Topic, OnboardingInput } from '@/types/onboarding'

export async function getActiveTopics(locale: string = 'es'): Promise<Topic[]> {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data, error } = await supabase
    .from('topics')
    .select('*')
    .eq('isActived', true)
    .order('name')

  if (error) {
    console.error('Error fetching topics:', error)
    return []
  }

  return data || []
}

export interface InterestCategory {
  id: string
  name: string
  name_es: string | null
  description: string | null
  description_es: string | null
}

export async function getInterestCategories(
  locale: string = 'es'
): Promise<InterestCategory[]> {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data, error } = await supabase
    .from('interest_categories')
    .select('*')
    .order('name')

  if (error) {
    console.error('Error fetching interest categories:', error)
    return []
  }

  return data || []
}

export async function submitOnboarding(
  data: OnboardingInput,
  locale: string = 'es'
) {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  // Validaciones básicas
  if (!data.birthDate) {
    return { error: 'Birth date is required' }
  }

  if (!data.selectedTopics || data.selectedTopics.length === 0) {
    return { error: 'At least one topic is required' }
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Unauthorized' }
  }

  // Get user profile for email
  const { data: profile } = await supabase
    .from('profiles')
    .select('first_name, email')
    .eq('id', user.id)
    .single()

  // Update profile with all onboarding data
  const { error: profileError } = await supabase
    .from('profiles')
    .update({
      birth_date: data.birthDate,
      sex: data.sex || null,
      location: data.location || null,
      phone: data.phone || null,
      bio: data.bio || null,
      dedication: data.dedication || null,
      institution: data.institution || null,
      research_interests: data.researchInterests || null,
      onboarding_completed: true,
    })
    .eq('id', user.id)

  if (profileError) {
    console.error('Profile update error:', profileError)
    return { error: 'Failed to update profile' }
  }

  // Insert selected topics into profile_topics
  const topicInserts = data.selectedTopics.map((topicId) => ({
    profile_id: user.id,
    topic_id: topicId,
  }))

  const { error: topicsError } = await supabase
    .from('profile_topics')
    .insert(topicInserts)

  if (topicsError) {
    console.error('Topics insert error:', topicsError)
    return { error: 'Failed to save topics' }
  }

  // Send welcome email
  if (profile?.email && profile?.first_name) {
    try {
      await sendWelcomeEmail({
        email: profile.email,
        firstName: profile.first_name,
        locale: locale,
      })
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError)
    }
  }

  redirect(`/${locale}/dashboard?welcome=true`)
}
