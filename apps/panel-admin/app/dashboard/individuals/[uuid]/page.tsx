import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  Pencil,
  Calendar,
  MapPin,
  Scale,
  Ruler,
  Egg,
  Dna,
  Building,
  User,
  Image as ImageIcon,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { fetchIndividualByUuidAdmin } from '@/services/individuals'
import { LayoutWrapper } from '@/components/layout-wrapper'
import { ROUTES } from '@/config'

interface PageProps {
  params: Promise<{ uuid: string }>
}

export default async function Page({ params }: PageProps) {
  const { uuid } = await params
  const individual = await fetchIndividualByUuidAdmin(uuid)

  if (!individual) {
    notFound()
  }

  return (
    <LayoutWrapper
      sectionTitle={`Individuo: ${individual.code || 'Sin código'}`}
      breadcrumbs={[
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Principal', href: '#' },
        { title: 'Individuos', href: ROUTES.CORE.INDIVIDUALS },
        { title: individual.code || 'Detalle' },
      ]}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight">
              Individuo: {individual.code || 'Sin código'}
            </h1>
            <p className="text-xs text-muted-foreground">
              {individual.species?.scientificName || 'Sin especie'}
            </p>
          </div>
          <Button size="sm" asChild className="text-xs">
            <Link href={`${ROUTES.CORE.INDIVIDUALS}/${individual.id}/edit`}>
              <Pencil className="mr-2 h-4 w-4" />
              Editar
            </Link>
          </Button>
        </div>

        {/* Status Badge */}
        <div className="flex gap-2">
          <Badge
            variant={individual.status === 1 ? 'default' : 'secondary'}
            className="text-xs"
          >
            {individual.status === 1 ? 'Activo' : 'Inactivo'}
          </Badge>
          {individual.hasEggs && (
            <Badge variant="outline" className="text-xs">
              <Egg className="mr-1 h-3 w-3" />
              Con huevos
            </Badge>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Información General */}
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <User className="h-4 w-4" />
                Información General
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-0">
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-muted-foreground">Código:</span>
                  <p className="font-medium">{individual.code || '-'}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Sexo:</span>
                  <p className="font-medium">{individual.sex?.name || '-'}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Fecha:</span>
                  <p className="font-medium flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {individual.identDate}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Hora:</span>
                  <p className="font-medium">{individual.identTime}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Actividad:</span>
                  <p className="font-medium">
                    {individual.activity?.name || '-'}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">
                    Código Genético:
                  </span>
                  <p className="font-medium flex items-center gap-1">
                    <Dna className="h-3 w-3" />
                    {individual.geneticBarcode || '-'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Taxonomía */}
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-sm font-semibold">Taxonomía</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-0">
              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-muted-foreground">
                    Nombre Científico:
                  </span>
                  <p className="font-medium text-sm">
                    {individual.species?.scientificName || '-'}
                  </p>
                </div>
                {individual.species?.commonName && (
                  <div>
                    <span className="text-muted-foreground">Nombre Común:</span>
                    <p className="font-medium">
                      {individual.species.commonName}
                    </p>
                  </div>
                )}
                <Separator />
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-muted-foreground">Clase:</span>
                    <p className="font-medium">
                      {individual.species?.genus?.family?.order?.class?.name ||
                        '-'}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Orden:</span>
                    <p className="font-medium">
                      {individual.species?.genus?.family?.order?.name || '-'}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Familia:</span>
                    <p className="font-medium">
                      {individual.species?.genus?.family?.name || '-'}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Género:</span>
                    <p className="font-medium">
                      {individual.species?.genus?.name || '-'}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Medidas */}
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Scale className="h-4 w-4" />
                Medidas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-0">
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-muted-foreground">Peso:</span>
                  <p className="font-medium">
                    {individual.weight ? `${individual.weight}g` : '-'}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Peso Faenado:</span>
                  <p className="font-medium">
                    {individual.slaughteredWeight
                      ? `${individual.slaughteredWeight}g`
                      : '-'}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">
                    Longitud Hocico-Cloaca:
                  </span>
                  <p className="font-medium flex items-center gap-1">
                    <Ruler className="h-3 w-3" />
                    {individual.svl ? `${individual.svl}mm` : '-'}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Longitud Cola:</span>
                  <p className="font-medium">
                    {individual.tailLength ? `${individual.tailLength}mm` : '-'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Ubicación y Museo */}
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Building className="h-4 w-4" />
                Ubicación y Museo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-0">
              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-muted-foreground">Museo:</span>
                  <p className="font-medium">
                    {individual.museum?.name || '-'}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Tipo de Bosque:</span>
                  <p className="font-medium">
                    {individual.forestType?.name || '-'}
                  </p>
                </div>
                {individual.ocurrence?.event?.locality && (
                  <>
                    <Separator />
                    <div>
                      <span className="text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        Localidad:
                      </span>
                      <p className="font-medium">
                        {individual.ocurrence.event.locality.name}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-muted-foreground">Latitud:</span>
                        <p className="font-medium">
                          {individual.ocurrence.event.latitude || '-'}
                        </p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Longitud:</span>
                        <p className="font-medium">
                          {individual.ocurrence.event.longitude || '-'}
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Imágenes */}
        {individual.files?.images && individual.files.images.length > 0 && (
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <ImageIcon className="h-4 w-4" />
                Imágenes ({individual.files.images.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {individual.files.images.map((image) => (
                  <div
                    key={image.id}
                    className="aspect-square rounded-md bg-muted flex items-center justify-center"
                  >
                    <span className="text-xs text-muted-foreground text-center px-2">
                      {image.name}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Metadatos */}
        <div className="text-xs text-muted-foreground space-y-1">
          <p>Creado: {new Date(individual.createdAt).toLocaleString()}</p>
          <p>Actualizado: {new Date(individual.updatedAt).toLocaleString()}</p>
        </div>
      </div>
    </LayoutWrapper>
  )
}
