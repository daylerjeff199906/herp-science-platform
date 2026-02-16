'use server'
import { revalidatePath } from 'next/cache'
import { fetchMethods, buildHeaders } from '@/lib/api'
import { ApiUrl, ADMIN_URLS } from '@/config'
import {
  IndividualFilter,
  IndividualResponse,
  IndividualDetails,
  Individual,
} from '@repo/shared-types'
import { fetchIndividualByUuid, fetchIndividualsAdmin } from '@repo/networking'

const apiBase = ApiUrl.core.individuals

const dataInitial: IndividualResponse = {
  data: [],
  currentPage: 1,
  totalItems: 0,
  totalPages: 0,
}

export async function fetchIndividuals(
  filter: IndividualFilter
): Promise<IndividualResponse> {
  const header = await buildHeaders()
  try {
    const data = await fetchIndividualsAdmin(filter, header)
    return data
  } catch (error) {
    console.error('Error fetching individuals:', error)
    return dataInitial
  }
}

export async function fetchIndividualByUuidAdmin(
  uuid: string
): Promise<IndividualDetails | null> {
  try {
    const data = await fetchIndividualByUuid(uuid)
    return data
  } catch (error) {
    console.error('Error fetching individual by UUID:', error)
    return null
  }
}

export async function fetchIndividualByIdAdmin(
  id: number
): Promise<Individual | null> {
  const headers = await buildHeaders()
  try {
    const response = (await fetchMethods.get(
      `${apiBase.urlApiAdmin}/${id}`,
      headers
    )) as Response
    if (response?.ok) {
      return response.json()
    } else {
      return null
    }
  } catch (error) {
    console.error('Error fetching individual by ID:', error)
    return null
  }
}

export interface CreateIndividualData {
  code: string
  weight?: string
  slaughteredWeight?: string
  svl?: string
  tailLength?: string
  hasEggs?: boolean
  identDate: string
  identTime: string
  geneticBarcode?: string
  depositCodeGenbank?: string
  sexId: number
  activityId: number
  forestTypeId?: number
  museumId: number
  speciesId: number
  occurrenceId?: number
  identifiers?: number[]
}

export async function createIndividual(data: CreateIndividualData): Promise<{
  success: boolean
  data?: Individual
  message?: string
  error?: string | string[]
}> {
  const headers = await buildHeaders()
  try {
    const response = (await fetchMethods.post(
      apiBase.urlApi,
      data,
      false,
      headers
    )) as Response

    if (response.ok) {
      const result = await response.json()
      revalidatePath(ADMIN_URLS.CORE.INDIVIDUALS)
      return {
        success: true,
        data: result,
        message: 'Individuo creado correctamente',
      }
    } else {
      const errorData = await response.json()
      return {
        success: false,
        error:
          errorData?.error ||
          errorData?.message ||
          'Error al crear el individuo',
      }
    }
  } catch (error) {
    console.error('Error creating individual:', error)
    return {
      success: false,
      error: 'Error al crear el individuo',
    }
  }
}

export async function updateIndividual(
  id: number,
  data: Partial<CreateIndividualData>
): Promise<{
  success: boolean
  data?: Individual
  message?: string
  error?: string | string[]
}> {
  const headers = await buildHeaders()
  try {
    const response = (await fetchMethods.patch(
      `${apiBase.urlApi}/${id}`,
      data,
      false,
      headers
    )) as Response

    if (response.ok) {
      const result = await response.json()
      revalidatePath(ADMIN_URLS.CORE.INDIVIDUALS)
      return {
        success: true,
        data: result,
        message: 'Individuo actualizado correctamente',
      }
    } else {
      const errorData = await response.json()
      return {
        success: false,
        error:
          errorData?.error ||
          errorData?.message ||
          'Error al actualizar el individuo',
      }
    }
  } catch (error) {
    console.error('Error updating individual:', error)
    return {
      success: false,
      error: 'Error al actualizar el individuo',
    }
  }
}

export async function changeStatusIndividual(id: number): Promise<{
  success: boolean
  message?: string
  error?: string | string[]
}> {
  const headers = await buildHeaders()
  try {
    const response = (await fetchMethods.patch(
      `${apiBase.changeStatusApi}/${id}`,
      undefined,
      false,
      headers
    )) as Response

    if (response.ok) {
      revalidatePath(ADMIN_URLS.CORE.INDIVIDUALS)
      return {
        success: true,
        message: 'Estado del individuo cambiado correctamente',
      }
    } else {
      const errorData = await response.json()
      return {
        success: false,
        error:
          errorData?.error ||
          errorData?.message ||
          'Error al cambiar el estado',
      }
    }
  } catch (error) {
    console.error('Error changing individual status:', error)
    return {
      success: false,
      error: 'Error al cambiar el estado del individuo',
    }
  }
}

export async function deleteIndividual(id: number): Promise<{
  success: boolean
  message?: string
  error?: string | string[]
}> {
  const headers = await buildHeaders()
  try {
    const response = (await fetchMethods.delete(
      `${apiBase.urlApi}/${id}`,
      headers
    )) as Response

    if (response.ok) {
      revalidatePath(ADMIN_URLS.CORE.INDIVIDUALS)
      return {
        success: true,
        message: 'Individuo eliminado correctamente',
      }
    } else {
      const errorData = await response.json()
      return {
        success: false,
        error:
          errorData?.error ||
          errorData?.message ||
          'Error al eliminar el individuo',
      }
    }
  } catch (error) {
    console.error('Error deleting individual:', error)
    return {
      success: false,
      error: 'Error al eliminar el individuo',
    }
  }
}

export async function restoreIndividual(id: number): Promise<{
  success: boolean
  message?: string
  error?: string | string[]
}> {
  const headers = await buildHeaders()
  try {
    const response = (await fetchMethods.get(
      `${apiBase.restoreApi}/${id}`,
      headers
    )) as Response

    if (response.ok) {
      revalidatePath(ADMIN_URLS.CORE.INDIVIDUALS)
      return {
        success: true,
        message: 'Individuo restaurado correctamente',
      }
    } else {
      const errorData = await response.json()
      return {
        success: false,
        error:
          errorData?.error ||
          errorData?.message ||
          'Error al restaurar el individuo',
      }
    }
  } catch (error) {
    console.error('Error restoring individual:', error)
    return {
      success: false,
      error: 'Error al restaurar el individuo',
    }
  }
}
