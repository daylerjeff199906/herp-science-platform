import { redirect } from 'next/navigation'

export default function LoginPage() {
  const authUrl = process.env.NEXT_PUBLIC_AUTH_URL || 'http://localhost:3003'
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3007'
  
  // En Next.js, redirect() se puede usar en Server Components
  redirect(`${authUrl}/es/login?redirect=${siteUrl}/dashboard`)

  return null
}
