import axios from 'axios'

// 1. Leemos la variable.
// Next.js inyectará el valor correspondiente dependiendo de qué App esté corriendo.
const API_URL = process.env.NEXT_PUBLIC_API_URL

// 2. Validación de seguridad (Buenas prácticas)
if (!API_URL) {
  // Esto hará que la app falle ruidosamente si olvidaste configurar el .env
  // Es mejor que falle aquí a que falle con un error 404 raro después.
  throw new Error(
    'FATAL: La variable de entorno NEXT_PUBLIC_API_URL no está definida.'
  )
}

export const apiClient = axios.create({
  baseURL: API_URL,
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
