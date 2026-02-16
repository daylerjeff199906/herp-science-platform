'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import {
  Individual,
  IndividualDetails,
  Sex,
  Activity,
  Museum,
  ForestType,
} from '@repo/shared-types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  createIndividual,
  updateIndividual,
  CreateIndividualData,
} from '@/services/individuals'
import { useRouter } from 'next/navigation'
import { ROUTES } from '@/config'

interface IndividualFormProps {
  initialData?: Individual | IndividualDetails | null
  sexes: Sex[]
  activities: Activity[]
  museums: Museum[]
  forestTypes: ForestType[]
  onSuccess?: () => void
}

export function IndividualForm({
  initialData,
  sexes,
  activities,
  museums,
  forestTypes,
  onSuccess,
}: IndividualFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [formData, setFormData] = useState({
    code: '',
    weight: '',
    slaughteredWeight: '',
    svl: '',
    tailLength: '',
    hasEggs: false,
    identDate: '',
    identTime: '',
    geneticBarcode: '',
    depositCodeGenbank: '',
    sexId: '',
    activityId: '',
    forestTypeId: '',
    museumId: '',
    speciesId: '',
    occurrenceId: '',
  })

  useEffect(() => {
    if (initialData) {
      setFormData({
        code: initialData.code || '',
        weight: initialData.weight || '',
        slaughteredWeight: initialData.slaughteredWeight || '',
        svl: initialData.svl || '',
        tailLength: initialData.tailLength || '',
        hasEggs: initialData.hasEggs || false,
        identDate: initialData.identDate || '',
        identTime: initialData.identTime || '',
        geneticBarcode: initialData.geneticBarcode || '',
        depositCodeGenbank: initialData.depositCodeGenbank || '',
        sexId: initialData.sex?.id ? String(initialData.sex.id) : '',
        activityId: initialData.activity?.id
          ? String(initialData.activity.id)
          : '',
        forestTypeId: initialData.forestType?.id
          ? String(initialData.forestType.id)
          : '',
        museumId: initialData.museum?.id ? String(initialData.museum.id) : '',
        speciesId: initialData.species?.id
          ? String(initialData.species.id)
          : '',
        occurrenceId: initialData.ocurrence?.id
          ? String(initialData.ocurrence.id)
          : '',
      })
    }
  }, [initialData])

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.code.trim()) {
      newErrors.code = 'El código es requerido'
    }
    if (!formData.identDate) {
      newErrors.identDate = 'La fecha de identificación es requerida'
    }
    if (!formData.identTime) {
      newErrors.identTime = 'La hora de identificación es requerida'
    }
    if (!formData.sexId) {
      newErrors.sexId = 'El sexo es requerido'
    }
    if (!formData.activityId) {
      newErrors.activityId = 'La actividad es requerida'
    }
    if (!formData.museumId) {
      newErrors.museumId = 'El museo es requerido'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast.error('Por favor complete todos los campos requeridos')
      return
    }

    setIsSubmitting(true)

    try {
      const submitData: CreateIndividualData = {
        code: formData.code,
        weight: formData.weight || undefined,
        slaughteredWeight: formData.slaughteredWeight || undefined,
        svl: formData.svl || undefined,
        tailLength: formData.tailLength || undefined,
        hasEggs: formData.hasEggs,
        identDate: formData.identDate,
        identTime: formData.identTime,
        geneticBarcode: formData.geneticBarcode || undefined,
        depositCodeGenbank: formData.depositCodeGenbank || undefined,
        sexId: Number(formData.sexId),
        activityId: Number(formData.activityId),
        forestTypeId: formData.forestTypeId
          ? Number(formData.forestTypeId)
          : undefined,
        museumId: Number(formData.museumId),
        speciesId: formData.speciesId ? Number(formData.speciesId) : 0,
        occurrenceId: formData.occurrenceId
          ? Number(formData.occurrenceId)
          : undefined,
        identifiers: [],
      }

      let result
      if (initialData) {
        result = await updateIndividual(initialData.id, submitData)
      } else {
        result = await createIndividual(submitData)
      }

      if (result.success) {
        toast.success(result.message || 'Operación exitosa')
        if (onSuccess) {
          onSuccess()
        } else {
          router.push(ROUTES.CORE.INDIVIDUALS)
        }
      } else {
        toast.error(
          typeof result.error === 'string' ? result.error : 'Error desconocido'
        )
      }
    } catch (error) {
      console.error(error)
      toast.error('Ocurrió un error inesperado')
    } finally {
      setIsSubmitting(false)
    }
  }

  const updateField = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Sección: Información General */}
      <Card>
        <CardHeader className="py-3">
          <CardTitle className="text-sm font-semibold">
            Información General
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-0">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="code" className="text-xs">
                Código *
              </Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) => updateField('code', e.target.value)}
                placeholder="Ingrese el código"
                className="h-9 text-xs"
              />
              {errors.code && (
                <span className="text-xs text-red-500">{errors.code}</span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="geneticBarcode" className="text-xs">
                Código Genético
              </Label>
              <Input
                id="geneticBarcode"
                value={formData.geneticBarcode}
                onChange={(e) => updateField('geneticBarcode', e.target.value)}
                placeholder="Código de barras genético"
                className="h-9 text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="identDate" className="text-xs">
                Fecha de Identificación *
              </Label>
              <Input
                id="identDate"
                type="date"
                value={formData.identDate}
                onChange={(e) => updateField('identDate', e.target.value)}
                className="h-9 text-xs"
              />
              {errors.identDate && (
                <span className="text-xs text-red-500">{errors.identDate}</span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="identTime" className="text-xs">
                Hora de Identificación *
              </Label>
              <Input
                id="identTime"
                type="time"
                value={formData.identTime}
                onChange={(e) => updateField('identTime', e.target.value)}
                className="h-9 text-xs"
              />
              {errors.identTime && (
                <span className="text-xs text-red-500">{errors.identTime}</span>
              )}
            </div>

            <div className="flex items-center space-x-2 pt-6">
              <Checkbox
                id="hasEggs"
                checked={formData.hasEggs}
                onCheckedChange={(checked) =>
                  updateField('hasEggs', checked as boolean)
                }
              />
              <Label htmlFor="hasEggs" className="text-xs">
                ¿Tiene huevos?
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sección: Clasificación */}
      <Card>
        <CardHeader className="py-3">
          <CardTitle className="text-sm font-semibold">Clasificación</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-0">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-xs">Sexo *</Label>
              <Select
                value={formData.sexId}
                onValueChange={(value) => updateField('sexId', value)}
              >
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue placeholder="Seleccionar sexo" />
                </SelectTrigger>
                <SelectContent>
                  {sexes.map((sex) => (
                    <SelectItem
                      key={sex.id}
                      value={String(sex.id)}
                      className="text-xs"
                    >
                      {sex.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.sexId && (
                <span className="text-xs text-red-500">{errors.sexId}</span>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-xs">Actividad *</Label>
              <Select
                value={formData.activityId}
                onValueChange={(value) => updateField('activityId', value)}
              >
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue placeholder="Seleccionar actividad" />
                </SelectTrigger>
                <SelectContent>
                  {activities.map((activity) => (
                    <SelectItem
                      key={activity.id}
                      value={String(activity.id)}
                      className="text-xs"
                    >
                      {activity.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.activityId && (
                <span className="text-xs text-red-500">
                  {errors.activityId}
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-xs">Museo *</Label>
              <Select
                value={formData.museumId}
                onValueChange={(value) => updateField('museumId', value)}
              >
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue placeholder="Seleccionar museo" />
                </SelectTrigger>
                <SelectContent>
                  {museums.map((museum) => (
                    <SelectItem
                      key={museum.id}
                      value={String(museum.id)}
                      className="text-xs"
                    >
                      {museum.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.museumId && (
                <span className="text-xs text-red-500">{errors.museumId}</span>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-xs">Tipo de Bosque</Label>
              <Select
                value={formData.forestTypeId}
                onValueChange={(value) => updateField('forestTypeId', value)}
              >
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue placeholder="Seleccionar tipo de bosque" />
                </SelectTrigger>
                <SelectContent>
                  {forestTypes.map((type) => (
                    <SelectItem
                      key={type.id}
                      value={String(type.id)}
                      className="text-xs"
                    >
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sección: Medidas */}
      <Card>
        <CardHeader className="py-3">
          <CardTitle className="text-sm font-semibold">Medidas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-0">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="weight" className="text-xs">
                Peso (g)
              </Label>
              <Input
                id="weight"
                type="number"
                step="0.01"
                value={formData.weight}
                onChange={(e) => updateField('weight', e.target.value)}
                placeholder="Peso en gramos"
                className="h-9 text-xs"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slaughteredWeight" className="text-xs">
                Peso Faenado (g)
              </Label>
              <Input
                id="slaughteredWeight"
                type="number"
                step="0.01"
                value={formData.slaughteredWeight}
                onChange={(e) =>
                  updateField('slaughteredWeight', e.target.value)
                }
                placeholder="Peso faenado"
                className="h-9 text-xs"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="svl" className="text-xs">
                LC (mm)
              </Label>
              <Input
                id="svl"
                type="number"
                step="0.01"
                value={formData.svl}
                onChange={(e) => updateField('svl', e.target.value)}
                placeholder="Longitud hocico-cloaca"
                className="h-9 text-xs"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tailLength" className="text-xs">
                Longitud Cola (mm)
              </Label>
              <Input
                id="tailLength"
                type="number"
                step="0.01"
                value={formData.tailLength}
                onChange={(e) => updateField('tailLength', e.target.value)}
                placeholder="Longitud de la cola"
                className="h-9 text-xs"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sección: Información Adicional */}
      <Card>
        <CardHeader className="py-3">
          <CardTitle className="text-sm font-semibold">
            Información Adicional
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-0">
          <div className="space-y-2">
            <Label htmlFor="depositCodeGenbank" className="text-xs">
              Código de Depósito GenBank
            </Label>
            <Input
              id="depositCodeGenbank"
              value={formData.depositCodeGenbank}
              onChange={(e) =>
                updateField('depositCodeGenbank', e.target.value)
              }
              placeholder="Código de depósito en GenBank"
              className="h-9 text-xs"
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push(ROUTES.CORE.INDIVIDUALS)}
          className="text-xs"
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting} className="text-xs">
          {isSubmitting
            ? 'Guardando...'
            : initialData
              ? 'Actualizar'
              : 'Guardar'}
        </Button>
      </div>
    </form>
  )
}
