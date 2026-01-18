'use server'
import { fetchMethods, buildHeaders } from '@/lib/api'
import { ADMIN_URLS, ApiUrl } from '../config'
import {
  ICountry,
  ICountryFilter,
  ICountryPost,
  IResApiList,
  IResApiMessage,
} from '@/types'
import { revalidatePath } from 'next/cache'

const apiBase = ApiUrl.location.countries

const dataInitial: IResApiList<ICountry> = {
  currentPage: 1,
  data: [],
  totalItems: 0,
  totalPages: 0,
}

export async function fetchCountries(
  filter: ICountryFilter
): Promise<IResApiList<ICountry>> {
  const { page, pageSize, name } = filter

  const params = new URLSearchParams()

  for (const [key, value] of Object.entries({ page, pageSize, name })) {
    if (value !== undefined && value !== null) {
      params.append(key, value.toString())
    }
  }

  const url = `${apiBase.urlApi}?${params.toString()}`

  try {
    const response = (await fetchMethods.get(url)) as Response
    const data = await response.json()
    if (response.status !== 200) {
      return dataInitial
    } else {
      return data
    }
  } catch (error) {
    console.error('Error fetching countries:', error)
    return dataInitial
  }
}

export async function fetchCountriesAdmin(
  filter: ICountryFilter
): Promise<IResApiList<ICountry>> {
  const { page, pageSize, name } = filter

  const params = new URLSearchParams()

  for (const [key, value] of Object.entries({ page, pageSize, name })) {
    if (value !== undefined && value !== null && value !== '') {
      params.append(key, value.toString())
    }
  }
  const url = `${apiBase.urlApiAdmin}?${params.toString()}`
  const headers = await buildHeaders()

  try {
    const response = (await fetchMethods.get(url, headers)) as Response
    console.log(response)
    if (response.status !== 200) {
      return dataInitial
    } else {
      return response.json()
    }
  } catch (error) {
    console.error('Error fetching countries (admin):', error)
    return dataInitial
  }
}

export async function fetchCountryById(id: number): Promise<ICountry | null> {
  try {
    const response = (await fetchMethods.get(
      `${apiBase.urlApi}/${id}`
    )) as Response
    if (response?.ok) {
      return response.json()
    } else {
      return null
    }
  } catch (error) {
    console.error('Error fetching country by ID:', error)
    return null
  }
}

export async function fetchCountryByIdAdmin(
  id: number
): Promise<ICountry | null> {
  try {
    const headers = await buildHeaders()
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
    console.error('Error fetching country by ID:', error)
    return null
  }
}

export async function createOrUpdateCountry({
  data,
  id,
}: {
  data: ICountryPost
  id?: number
}): Promise<{
  data: ICountry | null
  message?: string
  error?: string | string[] | null
}> {
  const apiUrl = id ? `${apiBase.urlApi}/${id}` : apiBase.urlApi
  const method = id ? fetchMethods.patch : fetchMethods.post

  const headers = await buildHeaders()

  try {
    const response = (await method(apiUrl, data, false, headers)) as Response
    console.log('Response from createOrUpdateCountry:', response)
    if (response?.ok) {
      revalidatePath(ADMIN_URLS.LOCATIONS.COUNTRIES)
      return {
        data: await response.json(),
        message: id
          ? 'País actualizado correctamente'
          : 'País creado correctamente',
        error: null,
      }
    } else {
      return {
        data: null,
        message: response.statusText || 'Error al crear o actualizar el país',
        error: response.statusText || ['Unknown error'],
      }
    }
  } catch (error) {
    console.error('Error creating or updating country:', error)
    const response = error as Response
    return {
      data: null,
      message: response.statusText || 'Error al crear o actualizar el país',
      error: response.statusText || ['Unknown error'],
    }
  }
}

export async function changeStatusCountry(id: number): Promise<IResApiMessage> {
  const headers = await buildHeaders()
  try {
    const response = (await fetchMethods.patch(
      `${apiBase.changeStatusApi}/${id}`,
      undefined,
      false,
      headers
    )) as Response
    if (response.ok) {
      revalidatePath(ADMIN_URLS.LOCATIONS.COUNTRIES)
      return {
        status: response.status,
        message: 'Estado del país cambiado correctamente',
        error: null,
      }
    } else {
      const resJson = await response.json()
      return {
        status: response.status,
        message: resJson?.message || 'Error al cambiar el estado del país',
        error: resJson?.error || ['Unknown error'],
      }
    }
  } catch (error) {
    console.error('Error changing status of country:', error)
    return {
      status: 500,
      message: 'Error al cambiar el estado del país',
      error: ['Internal Server Error'],
    }
  }
}

export async function deleteCountry(id: number): Promise<IResApiMessage> {
  const headers = await buildHeaders()
  try {
    const response = (await fetchMethods.delete(
      `${apiBase.urlApi}/${id}`,
      headers
    )) as Response
    if (response.ok) {
      revalidatePath(ADMIN_URLS.LOCATIONS.COUNTRIES)
      return {
        status: response.status,
        message: 'País eliminado correctamente',
        error: null,
      }
    } else {
      const resJson = await response.json()
      return {
        status: response.status,
        message: resJson?.message || 'Error al eliminar el país',
        error: resJson?.error || ['Unknown error'],
      }
    }
  } catch (error) {
    console.error('Error deleting country:', error)
    return {
      status: 500,
      message: 'Error al eliminar el país',
      error: ['Internal Server Error'],
    }
  }
}

export async function restoreCountry(
  id: number
): Promise<{ success: boolean; error?: string }> {
  const headers = await buildHeaders()
  try {
    const response = (await fetchMethods.get(
      `${apiBase.restoreApi}/${id}`,
      headers
    )) as Response
    if (!response.ok) {
      console.error('Error restoring country:', response.statusText)
      return {
        success: false,
        error: response.statusText || 'Error al restaurar el país',
      }
    }
    revalidatePath(ADMIN_URLS.LOCATIONS.COUNTRIES)
    return {
      success: true,
      error: undefined,
    }
  } catch (error) {
    console.error('Error restoring country:', error)
    return {
      success: false,
      error: 'Error al restaurar el país',
    }
  }
}
