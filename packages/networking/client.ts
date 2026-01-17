import axios from 'axios'

// Esta URL debería venir de variables de entorno, pero por ahora la dejamos base
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  'https://api-vertebrados.iiap.gob.pe/api/v1/'

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor para manejar errores globales (opcional pero recomendado)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message)
    return Promise.reject(error)
  }
)
