'use client'

import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface DetailLoadingProps {
  sections?: number
  className?: string
  showMetadata?: boolean
}

export function DetailLoading({
  sections = 4,
  className,
  showMetadata = true,
}: DetailLoadingProps) {
  return (
    <div className={cn('p-6 space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Skeleton className="h-9 w-24" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-3 w-32" />
          </div>
        </div>
        <Skeleton className="h-9 w-20" />
      </div>

      {/* Badges */}
      <div className="flex gap-2">
        <Skeleton className="h-5 w-16" />
        <Skeleton className="h-5 w-20" />
      </div>

      {/* Grid de secciones */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Array.from({ length: sections }).map((_, index) => (
          <Card key={index}>
            <CardHeader className="py-3">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-32" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-0">
              <div className="grid grid-cols-2 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="space-y-1">
                    <Skeleton className="h-2 w-16" />
                    <Skeleton className="h-3 w-full" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Imágenes */}
      <Card>
        <CardHeader className="py-3">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-24" />
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="aspect-square rounded-md" />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Metadatos */}
      {showMetadata && (
        <div className="space-y-1">
          <Skeleton className="h-2 w-48" />
          <Skeleton className="h-2 w-48" />
        </div>
      )}
    </div>
  )
}

// Variante simple para formularios
export function FormLoading({
  fields = 8,
  className,
}: {
  fields?: number
  className?: string
}) {
  return (
    <div className={cn('p-6 space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center gap-4">
        <Skeleton className="h-9 w-24" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-3 w-48" />
        </div>
      </div>

      {/* Formulario */}
      <Card>
        <CardHeader className="py-3">
          <Skeleton className="h-4 w-40" />
        </CardHeader>
        <CardContent className="space-y-6 pt-0">
          {Array.from({ length: Math.ceil(fields / 2) }).map((_, rowIndex) => (
            <div
              key={rowIndex}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {Array.from({ length: 2 }).map((_, colIndex) => {
                const fieldIndex = rowIndex * 2 + colIndex
                if (fieldIndex >= fields) return null
                return (
                  <div key={colIndex} className="space-y-2">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-9 w-full" />
                  </div>
                )
              })}
            </div>
          ))}

          {/* Botones */}
          <div className="flex justify-end gap-3 pt-4">
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-28" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
