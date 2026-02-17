import { getTranslations } from 'next-intl/server'
import OnboardingForm from './form'

interface OnboardingPageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: OnboardingPageProps) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'Onboarding' })
  return {
    title: t('title'),
  }
}



export default async function OnboardingPage({
  params,
}: OnboardingPageProps) {
  const { locale } = await params
  return (
    <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-1 lg:px-0 py-4">
      <div className="mx-auto flex w-full flex-col justify-center flex flex-col gap-4 max-w-md md:max-w-lg">
        <OnboardingForm locale={locale} />
      </div>
    </div>
  )
}
