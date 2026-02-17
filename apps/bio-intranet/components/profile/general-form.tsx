"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { GeneralProfileSchema, GeneralProfileData } from "@/lib/schemas/profile"
import { updateGeneralProfile } from "@/app/[locale]/dashboard/profile/actions"
import { useTranslations } from "next-intl"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@repo/ui"
import { Input } from "@repo/ui"
import { Textarea } from "@repo/ui"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@repo/ui"
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@repo/ui"
import { TopicSelector } from "@/components/onboarding/TopicSelector"
import { TagInput } from "@/components/onboarding/TagInput"
import { PhoneInput } from "@/components/ui/phone-input"
import type { Topic, InterestCategory } from "@/types/onboarding"

interface GeneralFormProps {
    initialData: Partial<GeneralProfileData>
    locale: string
    topics: Topic[]
    interestCategories: InterestCategory[]
}

export function GeneralForm({ initialData, locale, topics, interestCategories }: GeneralFormProps) {
    const t = useTranslations('Profile')
    const tOb = useTranslations('Onboarding') // Reuse onboarding translations for some labels
    const [isPending, setIsPending] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [selectedTopicIds, setSelectedTopicIds] = useState<number[]>([])
    const [expertiseInput, setExpertiseInput] = useState('')
    const [showSuggestions, setShowSuggestions] = useState(false)

    const form = useForm<GeneralProfileData>({
        resolver: zodResolver(GeneralProfileSchema),
        defaultValues: {
            firstName: initialData.firstName || '',
            lastName: initialData.lastName || '',
            email: initialData.email || '',
            bio: initialData.bio || '',
            location: initialData.location || '',
            birthDate: initialData.birthDate || '',
            phone: initialData.phone || '',
            dedication: initialData.dedication || '',
            institution: initialData.institution || '',
            researchInterests: initialData.researchInterests || '',
            areasOfInterest: initialData.areasOfInterest || [],
            expertiseAreas: initialData.expertiseAreas || [],
        },
    })

    // Sync initial topic selection
    useEffect(() => {
        const initialNames = initialData.areasOfInterest || []
        const ids = topics
            .filter(t => initialNames.includes(t.name) || initialNames.includes(t.name_es || ''))
            .map(t => t.id)
        setSelectedTopicIds(ids)
    }, [initialData.areasOfInterest, topics])

    const handleTopicToggle = (topicId: number) => {
        const newIds = selectedTopicIds.includes(topicId)
            ? selectedTopicIds.filter(id => id !== topicId)
            : [...selectedTopicIds, topicId]

        setSelectedTopicIds(newIds)

        // Map IDs back to names (canonical)
        const names = topics
            .filter(t => newIds.includes(t.id))
            .map(t => t.name)

        form.setValue('areasOfInterest', names, { shouldDirty: true })
    }

    const addExpertise = (expertise: string) => {
        const current = form.getValues('expertiseAreas') || []
        if (expertise.trim() && !current.includes(expertise.trim())) {
            form.setValue('expertiseAreas', [...current, expertise.trim()], { shouldDirty: true })
        }
    }

    const removeExpertise = (index: number) => {
        const current = form.getValues('expertiseAreas') || []
        form.setValue('expertiseAreas', current.filter((_, i) => i !== index), { shouldDirty: true })
    }

    // Suggestions for tag input
    const suggestions = interestCategories.map((cat) => ({
        id: cat.id,
        name: locale === 'es' && cat.name_es ? cat.name_es : cat.name,
        description:
            locale === 'es' && cat.description_es
                ? cat.description_es
                : cat.description || undefined,
    }))

    async function onSubmit(data: GeneralProfileData) {
        setIsPending(true)
        setError(null)
        setSuccess(false)
        try {
            const response = await updateGeneralProfile(locale, data)
            if (response.error) {
                setError(response.error)
            } else {
                setSuccess(true)
            }
        } catch (error) {
            setError(t('messages.updateError'))
        } finally {
            setIsPending(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {/* Header Actions */}
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-xl font-bold tracking-tight">{t('general.title')}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                            {t('general.description')}
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Button type="button" variant="ghost" onClick={() => form.reset()}>
                            {t('form.cancel')}
                        </Button>
                        <Button type="submit" disabled={isPending}>
                            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {t('form.save')}
                        </Button>
                    </div>
                </div>

                {success && (
                    <Alert className="border-green-500 text-green-600 bg-green-50 dark:bg-transparent">
                        <CheckCircle2 className="h-4 w-4" />
                        <AlertTitle>Success</AlertTitle>
                        <AlertDescription>{t('messages.updateSuccess')}</AlertDescription>
                    </Alert>
                )}

                {error && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {/* Account Details */}
                <div className="rounded-lg p-6 border space-y-6">
                    <h4 className="text-base font-bold text-foreground">{t('general.accountDetails')}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                            control={form.control}
                            name="firstName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('form.firstName')}</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="lastName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('form.lastName')}</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t('form.email')}</FormLabel>
                                <FormControl>
                                    <div className="flex items-center gap-2">
                                        <Input {...field} disabled className="bg-muted flex-1" />
                                        <span className="text-xs text-green-600 font-medium px-2 py-1 bg-green-50 rounded border border-green-200">Verified</span>
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {/* Personal Information */}
                <div className="rounded-lg p-6 border shadow-sm space-y-6">
                    <h4 className="text-base font-bold text-foreground">{t('general.personalInfo')}</h4>

                    <FormField
                        control={form.control}
                        name="bio"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t('form.bio')}</FormLabel>
                                <FormControl>
                                    <Textarea {...field} rows={4} placeholder={t('form.bioPlaceholder')} className="resize-none" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                            control={form.control}
                            name="location"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('form.location')}</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('form.phone')}</FormLabel>
                                    <FormControl>
                                        <PhoneInput {...field} defaultCountry="PE" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="birthDate"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>{t('form.birthDate')}</FormLabel>
                                    <FormControl>
                                        <Input type="date" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                {/* Professional Information */}
                <div className="rounded-lg p-6 border shadow-sm space-y-6">
                    <h4 className="text-base font-bold text-foreground">{t('general.professionalInfo')}</h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                            control={form.control}
                            name="dedication"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('form.dedication')}</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder={t('form.dedication')} />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="full_time">{tOb('ProfessionalInfo.dedication.options.full_time')}</SelectItem>
                                            <SelectItem value="part_time">{tOb('ProfessionalInfo.dedication.options.part_time')}</SelectItem>
                                            <SelectItem value="student">{tOb('ProfessionalInfo.dedication.options.student')}</SelectItem>
                                            <SelectItem value="researcher">{tOb('ProfessionalInfo.dedication.options.researcher')}</SelectItem>
                                            <SelectItem value="other">{tOb('ProfessionalInfo.dedication.options.other')}</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="institution"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('form.institution')}</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder={t('form.institutionPlaceholder')} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                {/* Interests */}
                <div className="rounded-lg p-6 border shadow-sm space-y-6">
                    <h4 className="text-base font-bold text-foreground">{t('general.interests')}</h4>

                    <div>
                        <FormLabel className="mb-2 block">{t('form.expertiseAreas')}</FormLabel>
                        <TagInput
                            tags={form.watch('expertiseAreas') || []}
                            onAdd={addExpertise}
                            onRemove={removeExpertise}
                            suggestions={suggestions}
                            label=""
                            description=""
                            placeholder={tOb('Interests.expertiseAreas.placeholder')}
                            inputValue={expertiseInput}
                            onInputChange={setExpertiseInput}
                            showSuggestions={showSuggestions}
                            onShowSuggestionsChange={setShowSuggestions}
                        />
                    </div>

                    <FormField
                        control={form.control}
                        name="researchInterests"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t('form.researchInterests')}</FormLabel>
                                <FormControl>
                                    <Textarea {...field} rows={3} placeholder={t('form.researchInterestsPlaceholder')} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div>
                        <FormLabel className="mb-2 block">{tOb('Interests.topics.label')}</FormLabel>
                        <TopicSelector
                            topics={topics}
                            selectedTopics={selectedTopicIds}
                            onToggle={handleTopicToggle}
                            locale={locale}
                        />
                    </div>
                </div>

                {/* Bottom Actions */}
                <div className="flex justify-end gap-3 pt-4">
                    <Button type="button" variant="ghost" onClick={() => form.reset()}>
                        {t('form.cancel')}
                    </Button>
                    <Button type="submit" disabled={isPending}>
                        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {t('form.save')}
                    </Button>
                </div>
            </form>
        </Form>
    )
}
