import { Suspense } from 'react'
import { FrmCountryEditor, HeaderSection } from '@/modules/admin'
import { FilterCountry } from '@/modules/admin'
import Loading from './loading'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3 md:gap-4">
      <HeaderSection
        title="Países"
        subtitle="Administración y gestión de los países. Aquí puedes visualizar, crear y editar los países existentes en la base de datos."
      />
      <Suspense fallback={<Loading />}>
        <div className="flex flex-col md:flex-row justify-between gap-3 md:gap-4">
          <FilterCountry />
          <FrmCountryEditor />
        </div>
        {children}
      </Suspense>
    </div>
  )
}
