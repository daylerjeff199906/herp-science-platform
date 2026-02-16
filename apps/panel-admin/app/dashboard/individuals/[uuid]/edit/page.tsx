
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
    code: individual.code,
    weight: individual.weight ? Number(individual.weight) : undefined,
    slaughteredWeight: individual.slaughteredWeight ? Number(individual.slaughteredWeight) : undefined,
    svl: individual.svl ? Number(individual.svl) : undefined,
    tailLength: individual.tailLength ? Number(individual.tailLength) : undefined,
    hasEggs: individual.hasEggs,
    identDate: individual.identDate,
    identTime: individual.identTime,
    geneticBarcode: individual.geneticBarcode,
    depositCodeGenbank: individual.depositCodeGenbank,
    sexId: individual.sex?.id,
    activityId: individual.activity?.id,
    forestId: individual.forestType?.id,
    museumId: individual.museum?.id,
    speciesId: individual.species?.id,
    occurrenceId: individual.ocurrence?.id,
    status: individual.status || 1,
  }

  return (
    <GeneralInfoForm
      initialData={defaultValues}
      sexes={sexes}
      museums={museums}
      forestTypes={forestTypes}
      species={species}
      activities={[]} // TODO
      occurrences={[]} // TODO
    />
  )
}
