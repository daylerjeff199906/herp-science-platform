import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import type { Metadata } from 'next'
import { GoogleAnalytics } from '@next/third-parties/google'
import { Inter } from 'next/font/google'
import '../globals.css'
import { Providers } from './providers'
import { Header } from '../../components/layouts/Header/Header'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Anfibios y Reptiles',
  description:
    'Colección de Anfibios y Reptiles del Instituto de Investigación de la Amazonía Peruana',
  openGraph: {
    images: [
      {
        url: 'https://firebasestorage.googleapis.com/v0/b/species-iiap-bb45a.appspot.com/o/amphibians%2Famphibians-v1.webp?alt=media&token=4d1bd3cf-5cd0-4e23-be41-d73bfa5c0f58',
        width: 1200,
        height: 630,
        alt: 'colección de anfibios y reptiles del IIAP',
      },
    ],
  },
}

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export default async function RootLayout(props: Props) {
  const params = await props.params
  const { locale } = params
  const messages = await getMessages()
  const children = props.children

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <NextIntlClientProvider messages={messages}>
            <Header />
            <main>{children}</main>
            <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA4_ID || ''} />
          </NextIntlClientProvider>
        </Providers>
      </body>
    </html>
  )
}
