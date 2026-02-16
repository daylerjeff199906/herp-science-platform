
import { notFound } from 'next/navigation'
import { fetchIndividualByUuid } from '@/services/individuals'
import { AudioForm } from './audio-form'

interface PageProps {
    params: Promise<{ uuid: string }>
}

export default async function EditAudioPage({ params }: PageProps) {
    const { uuid } = await params

    const individual = await fetchIndividualByUuid(uuid)

    if (!individual) {
        notFound()
    }

    // TODO: Fetch existing audio for this individual to display or allow edit/delete

    return (
        <AudioForm
            individualId={individual.id}
            initialAudio={[]} // TODO
        />
    )
}
