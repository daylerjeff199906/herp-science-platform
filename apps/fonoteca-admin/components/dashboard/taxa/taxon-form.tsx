"use client"

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { taxonSchema, TaxonInput } from "@/lib/validations/fonoteca";
import { getTaxon, createTaxon, updateTaxon, getGenera } from "@/actions/taxa";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function TaxonForm({ id, onSuccess }: { id: string | null; onSuccess: () => void }) {
  const [loading, setLoading] = useState(false);
  const [genera, setGenera] = useState<any[]>([]);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<TaxonInput>({
    resolver: zodResolver(taxonSchema) as any,
    defaultValues: {
      taxonRank: "species",
      nomenclaturalCode: "ICZN",
    } as any
  });

  useEffect(() => {
    // Fetch genera list for the select
    getGenera().then(res => {
      if (res.data) setGenera(res.data);
    });

    if (id) {
      setLoading(true);
      getTaxon(id).then((resp) => {
        setLoading(false);
        if (resp.data) {
          reset({
            ...resp.data,
            genus_id: resp.data.genus_id || "",
          });
        } else {
          toast.error("Error al cargar taxón: " + resp.error);
        }
      });
    } else {
      reset({
        taxonRank: "species",
        nomenclaturalCode: "ICZN",
        scientificName: "",
        genus_id: "",
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
      <div className="space-y-2 border-b pb-4">
        <h3 className="text-sm font-semibold text-foreground">Información Científica</h3>
        <p className="text-xs text-muted-foreground">Define nombre y epítetos relativos.</p>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Nombre Científico *</label>
        <Input {...register("scientificName")} placeholder="Example species" />
        {errors.scientificName && <p className="text-xs text-red-500">{errors.scientificName.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Género (Familia) *</label>
          <select
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            {...register("genus_id")}
          >
            <option value="">Seleccionar Género</option>
            {genera.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name} ({g.family?.name || "Sin Familia"})
              </option>
            ))}
          </select>
          {errors.genus_id && <p className="text-xs text-red-500">{errors.genus_id.message}</p>}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Rango Taxonómico</label>
          <Input {...register("taxonRank")} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Epíteto Específico</label>
          <Input {...register("specificEpithet")} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Epíteto Infraspecífico</label>
          <Input {...register("infraspecificEpithet")} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Nombre Común/Vernacular</label>
          <Input {...register("vernacularName")} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Autoría</label>
          <Input {...register("scientificNameAuthorship")} />
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button type="submit" disabled={loading}>
          {loading ? "Guardando..." : id ? "Guardar Cambios" : "Registrar"}
        </Button>
      </div>
    </form>
  );
}

