"use client"

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { taxonSchema, TaxonInput } from "@/lib/validations/fonoteca";
import { createTaxon, updateTaxon, getTaxon } from "@/actions/taxa";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export function TaxonForm({ id, onSuccess }: { id: string | null; onSuccess: () => void }) {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<TaxonInput>({
    resolver: zodResolver(taxonSchema) as any,
    defaultValues: {
      kingdom: "Animalia",
      taxonRank: "species",
      nomenclaturalCode: "ICZN",
    } as any
  });

  useEffect(() => {
    if (id) {
      setLoading(true);
      getTaxon(id).then((resp) => {
        setLoading(false);
        if (resp.data) {
          reset(resp.data);
        } else {
          toast.error("Error al cargar taxón: " + resp.error);
        }
      });
    } else {
      reset({
        kingdom: "Animalia",
        taxonRank: "species",
        nomenclaturalCode: "ICZN",
        scientificName: "",
        family: "",
        genus: "",
      });
    }
  }, [id, reset]);

  const onSubmit = async (data: TaxonInput) => {
    setLoading(true);
    let resp;
    if (id) {
      resp = await updateTaxon(id, data);
    } else {
      resp = await createTaxon(data);
    }
    setLoading(false);

    if (resp.success) {
      toast.success(id ? "Taxón actualizado" : "Taxón registrado");
      onSuccess();
    } else {
      toast.error("Error: " + (typeof resp.error === "string" ? resp.error : "Falló la validación"));
    }
  };

  if (loading && id) {
    return <div className="text-center py-4">Cargando datos...</div>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Nombre Científico *</label>
        <Input {...register("scientificName")} placeholder="Example species" />
        {errors.scientificName && <p className="text-xs text-red-500">{errors.scientificName.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Reino</label>
          <Input {...register("kingdom")} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Familia</label>
          <Input {...register("family")} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Género</label>
          <Input {...register("genus")} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Especie Especial / Infraspec.</label>
          <Input {...register("specificEpithet")} />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Rango Taxonómico</label>
        <Input {...register("taxonRank")} />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Nombre Común/Vernacular</label>
        <Input {...register("vernacularName")} />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="submit" disabled={loading}>
          {loading ? "Guardando..." : id ? "Guardar Cambios" : "Registrar"}
        </Button>
      </div>
    </form>
  );
}
