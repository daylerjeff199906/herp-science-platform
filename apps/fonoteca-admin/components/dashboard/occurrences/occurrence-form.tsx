"use client"

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { occurrenceSchema, OccurrenceInput } from "@/lib/validations/fonoteca";
import { createOccurrence, updateOccurrence, getOccurrence } from "@/actions/occurrences";
import { getTaxa } from "@/actions/taxa";
import { getLocations } from "@/actions/locations";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Location, Taxon } from "@/types/fonoteca";
import { FileText, FolderTree, Calendar, Building } from "lucide-react";
import { Button } from "@repo/ui/components/ui/button";

export function OccurrenceForm({ id }: { id?: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [taxa, setTaxa] = useState<Taxon[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<OccurrenceInput>({
    resolver: zodResolver(occurrenceSchema) as any,
    defaultValues: {
      basisOfRecord: "HumanObservation",
      institutionCode: "IIAP",
      collectionCode: "Fonoteca",
      profile_id: "00000000-0000-0000-0000-000000000000"
    }
  });

  useEffect(() => {
    getTaxa({ limit: 100 }).then(resp => setTaxa(resp.data));
    getLocations({ limit: 100 }).then(resp => setLocations(resp.data));

    if (id) {
      setLoading(true);
      getOccurrence(id).then((resp) => {
        setLoading(false);
        if (resp.data) {
          reset(resp.data);
        } else {
          toast.error("Error al cargar ocurrencia");
        }
      });
    }
  }, [id, reset]);

  const onSubmit = async (data: OccurrenceInput) => {
    setLoading(true);
    let resp;
    if (id) {
      resp = await updateOccurrence(id, data);
    } else {
      resp = await createOccurrence(data);
    }
    setLoading(false);

    if (resp.success) {
      toast.success(id ? "Ocurrencia actualizada" : "Ocurrencia registrada");
      router.push("/dashboard/occurrences");
    } else {
      toast.error("Error: " + (typeof resp.error === "string" ? resp.error : "Falló la validación"));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 w-full max-w-7xl">
      {/* 1. Datos Básicos */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Datos Básicos</h3>
        </div>
        <div className="divide-y divide-muted/10 border-t border-b border-muted/10">
          <div className="flex items-center justify-between gap-4 py-3">
            <div className="w-1/4 flex items-center">
              <label className="text-xs font-semibold text-muted-foreground uppercase cursor-pointer">Occurrence ID *</label>
            </div>
            <div className="w-3/4">
              <Input {...register("occurrenceID")} placeholder="Ex: FON-001" className="bg-transparent border-none shadow-none h-8 font-medium focus-visible:ring-1 focus-visible:ring-primary/20 px-2 max-w-xl" />
              {errors.occurrenceID && <p className="text-xs text-red-500 mt-1 px-2">{errors.occurrenceID.message}</p>}
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 py-3">
            <div className="w-1/4 flex items-center">
              <label className="text-xs font-semibold text-muted-foreground uppercase">Basis of Record *</label>
            </div>
            <div className="w-3/4">
              <Input {...register("basisOfRecord")} className="bg-transparent border-none shadow-none h-8 font-medium focus-visible:ring-1 focus-visible:ring-primary/20 px-2 max-w-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Taxonomía y Ubicación */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <FolderTree className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Taxonomía y Ubicación</h3>
        </div>
        <div className="divide-y divide-muted/10 border-t border-b border-muted/10">
          <div className="flex items-center justify-between gap-4 py-3">
            <div className="w-1/4 flex items-center">
              <label className="text-xs font-semibold text-muted-foreground uppercase">Taxón *</label>
            </div>
            <div className="w-3/4">
              <select
                {...register("taxon_id")}
                className="flex h-8 w-full max-w-xl rounded-md border-none bg-transparent px-2 text-sm shadow-none font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/20"
              >
                <option value="">Seleccionar Taxón...</option>
                {taxa.map(t => (
                  <option key={t.id} value={t.id}>{t.scientificName} ({t.vernacularName || "-"})</option>
                ))}
              </select>
              {errors.taxon_id && <p className="text-xs text-red-500 mt-1 px-2">{errors.taxon_id.message}</p>}
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 py-3">
            <div className="w-1/4 flex items-center">
              <label className="text-xs font-semibold text-muted-foreground uppercase">Ubicación *</label>
            </div>
            <div className="w-3/4">
              <select
                {...register("location_id")}
                className="flex h-8 w-full max-w-xl rounded-md border-none bg-transparent px-2 text-sm shadow-none font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/20"
              >
                <option value="">Seleccionar Ubicación...</option>
                {locations.map(l => (
                  <option key={l.id} value={l.id}>{l.locality} ({l.stateProvince || l.country})</option>
                ))}
              </select>
              {errors.location_id && <p className="text-xs text-red-500 mt-1 px-2">{errors.location_id.message}</p>}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Temporalidad y Monitoreo */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Temporalidad y Monitoreo</h3>
        </div>
        <div className="divide-y divide-muted/10 border-t border-b border-muted/10">
          <div className="flex items-center justify-between gap-4 py-3">
            <div className="w-1/4 flex items-center">
              <label className="text-xs font-semibold text-muted-foreground uppercase">Fecha *</label>
            </div>
            <div className="w-3/4">
              <Input type="date" {...register("eventDate")} className="bg-transparent border-none shadow-none h-8 font-medium focus-visible:ring-1 focus-visible:ring-primary/20 px-2 max-w-xl" />
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 py-3">
            <div className="w-1/4 flex items-center">
              <label className="text-xs font-semibold text-muted-foreground uppercase">Registrado Por *</label>
            </div>
            <div className="w-3/4">
              <Input {...register("recordedBy")} className="bg-transparent border-none shadow-none h-8 font-medium focus-visible:ring-1 focus-visible:ring-primary/20 px-2 max-w-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* 4. Institución */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Building className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Institución y Colección</h3>
        </div>
        <div className="divide-y divide-muted/10 border-t border-b border-muted/10">
          <div className="flex items-center justify-between gap-4 py-3">
            <div className="w-1/4 flex items-center">
              <label className="text-xs font-semibold text-muted-foreground uppercase">Institución</label>
            </div>
            <div className="w-3/4">
              <Input {...register("institutionCode")} className="bg-transparent border-none shadow-none h-8 font-medium focus-visible:ring-1 focus-visible:ring-primary/20 px-2 max-w-xl" />
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 py-3">
            <div className="w-1/4 flex items-center">
              <label className="text-xs font-semibold text-muted-foreground uppercase">Colección</label>
            </div>
            <div className="w-3/4">
              <Input {...register("collectionCode")} className="bg-transparent border-none shadow-none h-8 font-medium focus-visible:ring-1 focus-visible:ring-primary/20 px-2 max-w-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* 5. Extra */}
      <div className="divide-y divide-muted/10 border-t border-b border-muted/10">
        <div className="flex items-center justify-between gap-4 py-3">
          <div className="w-1/4 flex items-center">
            <label className="text-xs font-semibold text-muted-foreground uppercase">Observaciones</label>
          </div>
          <div className="w-3/4">
            <Input {...register("occurrenceRemarks")} placeholder="Detalles extra del avistamiento..." className="bg-transparent border-none shadow-none h-8 font-medium focus-visible:ring-1 focus-visible:ring-primary/20 px-2 max-w-xl" />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4 border-t border-muted/20 mt-6">
        <Button variant="outline" asChild>
          <Link href="/dashboard/occurrences">Cancelar</Link>
        </Button>
        <Button type="submit" disabled={loading} className="min-w-[120px]">
          {loading ? "Guardando..." : id ? "Guardar Cambios" : "Registrar"}
        </Button>
      </div>
    </form>
  );
}
