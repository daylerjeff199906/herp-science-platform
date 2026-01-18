import type { Metadata } from 'next'
import { GoogleAnalytics } from '@next/third-parties/google'
import { Open_Sans } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { Header } from '../components/layouts/Header/Header'

const openSans = Open_Sans({
  weight: ['400', '700'],
  style: ['normal'],
  subsets: ['latin'],
  fallback: ['sans-serif'],
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={openSans.className}>
        <Providers>
          <Header />
          <main>{children}</main>
        </Providers>
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA4_ID || ''} />
      </body>
    </html>
  )
}
