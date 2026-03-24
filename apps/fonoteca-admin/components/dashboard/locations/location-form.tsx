"use client"

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { locationSchema, LocationInput } from "@/lib/validations/fonoteca";
import { createLocation, updateLocation, getLocation } from "@/actions/locations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";

export function LocationForm({ id }: { id?: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<LocationInput>({
    resolver: zodResolver(locationSchema),
    defaultValues: {
      continent: "South America",
      country: "Peru",
      countryCode: "PE",
    }
  });

  useEffect(() => {
    if (id) {
      setLoading(true);
      getLocation(id).then((resp) => {
        setLoading(false);
        if (resp.data) {
          reset(resp.data);
        } else {
          toast.error("Error al cargar ubicación");
        }
      });
    }
  }, [id, reset]);

  const onSubmit = async (data: LocationInput) => {
    setLoading(true);
    let resp;
    if (id) {
      resp = await updateLocation(id, data);
    } else {
      resp = await createLocation(data);
    }
    setLoading(false);

    if (resp.success) {
      toast.success(id ? "Ubicación actualizada" : "Ubicación registrada");
      router.push("/dashboard/locations");
    } else {
      toast.error("Error: " + (typeof resp.error === "string" ? resp.error : "Falló la validación"));
    }
  };

  if (loading && id) {
    return <div className="text-center py-4">Cargando datos...</div>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-2xl bg-card border p-6 rounded-lg">
      <div className="space-y-2">
        <label className="text-sm font-medium">Localidad *</label>
        <Input {...register("locality")} placeholder="Ex: Río Itaya" />
        {errors.locality && <p className="text-xs text-red-500">{errors.locality.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Estado / Provincia</label>
          <Input {...register("stateProvince")} placeholder="Ex: Loreto" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Condado / Distrito</label>
          <Input {...register("county")} placeholder="Ex: Maynas" />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">País</label>
          <Input {...register("country")} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Código País</label>
          <Input {...register("countryCode")} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Continente</label>
          <Input {...register("continent")} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 border-t pt-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Latitud Decimal</label>
          <Input type="number" step="any" {...register("decimalLatitude")} placeholder="-3.749" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Longitud Decimal</label>
          <Input type="number" step="any" {...register("decimalLongitude")} placeholder="-73.25" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Elevación (m)</label>
          <Input type="number" step="any" {...register("elevation")} placeholder="120" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Hábitat</label>
          <Input {...register("habitat")} placeholder="Ex: Bosque primario" />
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" onClick={() => router.push("/dashboard/locations")}>
          Cancelar
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Guardando..." : id ? "Guardar Cambios" : "Registrar"}
        </Button>
      </div>
    </form>
  );
}
