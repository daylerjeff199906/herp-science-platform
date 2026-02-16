
import { notFound } from 'next/navigation'
import { fetchIndividualByUuid } from '@/services/individuals'
import { MultimediaForm } from './multimedia-form'

interface PageProps {
    params: Promise<{ uuid: string }>
}

export default async function EditMultimediaPage({ params }: PageProps) {
    const { uuid } = await params

    const individual = await fetchIndividualByUuid(uuid)

    if (!individual) {
        notFound()
    }

    // TODO: Fetch existing multimedia for this individual to display or allow edit/delete

    return (
        <MultimediaForm
            individualId={individual.id}
            initialImages={[]} // TODO
        />
    )
}
