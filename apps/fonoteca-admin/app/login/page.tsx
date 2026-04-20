import { redirect } from 'next/navigation'

export default function LoginPage() {
  const isProd = process.env.NODE_ENV === 'production';
  const authUrl = isProd ? 'https://auth.iiap.gob.pe' : 'http://localhost:3003';
  const siteUrl = isProd ? 'https://fonoteca.iiap.gob.pe' : 'http://localhost:3006';
  
  redirect(`${authUrl}/es/login?redirect=${siteUrl}/dashboard`)

  return null
}
