'use client'

import { useState } from 'react'
import { useCountries } from '@repo/networking'
import { CountryFilter } from '@repo/shared-types' // Importamos el tipo para el estado

export default function CountriesPage() {
  // 1. Estado local para manejar los filtros
  const [filters, setFilters] = useState<CountryFilter>({
    page: 1,
    pageSize: 10,
    name: '', // Inicialmente vacío
  })

  // 2. Usamos el Hook (Se ejecuta cada vez que 'filters' cambia)
  const { data, isLoading, isError, isFetching } = useCountries(filters)
  // Manejadores de eventos
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({ ...prev, name: e.target.value, page: 1 })) // Reset a página 1 al buscar
  }

  const handleNextPage = () => {
    if (data && filters.page! < data.totalPages) {
      setFilters((prev) => ({ ...prev, page: (prev.page || 1) + 1 }))
    }
  }

  const handlePrevPage = () => {
    setFilters((prev) => ({ ...prev, page: Math.max((prev.page || 1) - 1, 1) }))
  }

  if (isError) return <div className="text-red-500">Error cargando países.</div>

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Directorio de Países
      </h1>

      {/* --- BARRA DE BÚSQUEDA --- */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Buscar país (Ej: Peru)..."
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          value={filters.name}
          onChange={handleSearch}
        />
        {isFetching && (
          <span className="text-sm text-gray-500 mt-1 block">
            Actualizando...
          </span>
        )}
      </div>

      {/* --- TABLA DE RESULTADOS --- */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {isLoading ? (
          <div className="p-10 text-center text-gray-500">
            Cargando datos...
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Nombre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Creado
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data?.data.map((country) => (
                <tr key={country.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-mono text-gray-500">
                    {country.id}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {country.name}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {country.status === 1 ? (
                      <span className="px-2 py-1 text-xs text-green-700 bg-green-100 rounded-full">
                        Activo
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs text-red-700 bg-red-100 rounded-full">
                        Inactivo
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(country.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* --- PAGINACIÓN --- */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={handlePrevPage}
          disabled={filters.page === 1}
          className="px-4 py-2 border rounded disabled:opacity-50 hover:bg-gray-100"
        >
          Anterior
        </button>
        <span className="text-sm text-gray-600">
          Página {data?.currentPage} de {data?.totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={!data || filters.page === data.totalPages}
          className="px-4 py-2 border rounded disabled:opacity-50 hover:bg-gray-100"
        >
          Siguiente
        </button>
      </div>
    </div>
  )
}
