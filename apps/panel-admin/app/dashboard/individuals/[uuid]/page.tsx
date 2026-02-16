
import { permanentRedirect } from 'next/navigation'

interface PageProps {
  params: Promise<{ uuid: string }>
}

export default async function Page({ params }: PageProps) {
  const { uuid } = await params
  // Redirect /individuals/[uuid] to /individuals/[uuid]/edit
  permanentRedirect(`/dashboard/individuals/${uuid}/edit`)
}
