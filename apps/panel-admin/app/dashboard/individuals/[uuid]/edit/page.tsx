
import { notFound } from 'next/navigation'
import { fetchIndividualByUuid } from '@/services/individuals'
import {
  fetchSexes,
  fetchMuseums,
  fetchForestTypes,
  fetchSpecies
} from '@repo/networking'
import { GeneralInfoForm } from './general-info-form'

interface PageProps {
  params: Promise<{ uuid: string }>
}

export default async function EditGeneralPage({ params }: PageProps) {
  const { uuid } = await params

  const [individual, sexes, museums, forestTypes, species] = await Promise.all([
    fetchIndividualByUuid(uuid),
    fetchSexes({ page: 1, pageSize: 100 }).then(res => res.data).catch(() => []),
    fetchMuseums({ page: 1, pageSize: 100 }).then(res => res.data).catch(() => []),
    fetchForestTypes({ page: 1, pageSize: 100 }).then(res => res.data).catch(() => []),
    fetchSpecies({ page: 1, pageSize: 100 }).then(res => res.data).catch(() => [])
  ])

  if (!individual) {
    notFound()
  }

  // Map individual details to form initial values
  const defaultValues = {
    id: individual.id,
    code: individual.code || '',
    weight: individual.weight ? Number(individual.weight) : undefined,
    slaughteredWeight: individual.slaughteredWeight ? Number(individual.slaughteredWeight) : undefined,
    svl: individual.svl ? Number(individual.svl) : undefined,
    tailLength: individual.tailLength ? Number(individual.tailLength) : undefined,
    hasEggs: individual.hasEggs,
    identDate: individual.identDate ?? undefined,
    identTime: individual.identTime ?? undefined,
    geneticBarcode: individual.geneticBarcode ?? undefined,
    depositCodeGenbank: individual.depositCodeGenbank ?? undefined,
    sexId: Number(individual.sex?.id) || 0,
    activityId: Number(individual.activity?.id) || 0,
    forestId: Number(individual.forestType?.id) || 0,
    museumId: Number(individual.museum?.id) || 0,
    speciesId: Number(individual.species?.id) || 0,
    occurrenceId: Number(individual.ocurrence?.id) || 0,
    status: individual.status || 1,
  }

  return (
    <GeneralInfoForm
      initialData={defaultValues}
      sexes={sexes?.map(sex => ({ id: Number(sex.id), name: sex.name })) || []}
      museums={museums?.map(museum => ({ id: Number(museum.id), name: museum.name })) || []}
      forestTypes={forestTypes?.map(forestType => ({ id: Number(forestType.id), name: forestType.name })) || []}
      species={species?.map(species => ({ id: Number(species.id), name: species.commonName })) || []}
      activities={[]} // TODO
      occurrences={[]} // TODO
    />
  )
}
