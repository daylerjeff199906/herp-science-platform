
import {
    fetchSexes,
    fetchMuseums,
    fetchForestTypes,
    fetchSpecies
} from '@repo/networking'
import { CreateGeneralForm } from './create-general-form'
import { Option } from '@/components/ui/dynamic-filters'

export default async function CreateIndividualPage() {
    // Parallel fetch of options
    const [sexes, museums, forestTypes, species] = await Promise.all([
        fetchSexes({ page: 1, pageSize: 100 }).then(res => res.data).catch(() => []),
        fetchMuseums({ page: 1, pageSize: 100 }).then(res => res.data).catch(() => []),
        fetchForestTypes({ page: 1, pageSize: 100 }).then(res => res.data).catch(() => []),
        fetchSpecies({ page: 1, pageSize: 100 }).then(res => res.data).catch(() => [])
    ])

    // Mock data for missing services
    const activities: Option[] = []
    const occurrences: Option[] = []

    return (
        <div className="max-w-4xl">
            <CreateGeneralForm
                sexes={sexes?.map(sex => ({ id: Number(sex.id), name: sex.name }))}
                forestTypes={forestTypes?.map(forestType => ({ id: Number(forestType.id), name: forestType.name }))}
                museums={museums?.map(museum => ({ id: Number(museum.id), name: museum.name }))}
                species={species?.map(species => ({ id: Number(species.id), name: species.commonName }))}
                activities={activities?.map(activity => ({ id: Number(activity.id), name: activity.name }))}
                occurrences={occurrences?.map(occurrence => ({ id: Number(occurrence.id), name: occurrence.name }))}
            />
        </div>
    );
}
