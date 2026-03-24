"use client"

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { occurrenceSchema, OccurrenceInput } from "@/lib/validations/fonoteca";
import { createOccurrence, updateOccurrence, getOccurrence } from "@/actions/occurrences";
import { getTaxa } from "@/actions/taxa";
import { getLocations } from "@/actions/locations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Location, Taxon } from "@/types/fonoteca";

export function OccurrenceForm({ id }: { id?: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [taxa, setTaxa] = useState<Taxon[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<OccurrenceInput>({
    resolver: zodResolver(occurrenceSchema) as any,
    defaultValues: {
      basisOfRecord: "HumanObservation",
      institutionCode: "IIAP",
      collectionCode: "Fonoteca",
      profile_id: "00000000-0000-0000-0000-000000000000" // We'll mock this for now or ignore since no profiles list available yet. Wait, schema NOT NULL!
    }
  });

  useEffect(() => {
    // Load lists for the pickers
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-3xl bg-card border p-6 rounded-lg">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Occurrence ID / Código *</label>
          <Input {...register("occurrenceID")} placeholder="Ex: FON-001" />
          {errors.occurrenceID && <p className="text-xs text-red-500">{errors.occurrenceID.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Basis of Record *</label>
          <Input {...register("basisOfRecord")} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 border-t pt-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Taxón *</label>
          <select
            {...register("taxon_id")}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="">Seleccionar Taxón...</option>
            {taxa.map(t => (
              <option key={t.id} value={t.id}>{t.scientificName} ({t.vernacularName || "-"})</option>
            ))}
          </select>
          {errors.taxon_id && <p className="text-xs text-red-500">{errors.taxon_id.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Ubicación *</label>
          <select
            {...register("location_id")}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="">Seleccionar Ubicación...</option>
            {locations.map(l => (
              <option key={l.id} value={l.id}>{l.locality} ({l.stateProvince || l.country})</option>
            ))}
          </select>
          {errors.location_id && <p className="text-xs text-red-500">{errors.location_id.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Fecha *</label>
          <Input type="date" {...register("eventDate")} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Registrado Por *</label>
          <Input {...register("recordedBy")} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Institución</label>
          <Input {...register("institutionCode")} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Colección</label>
          <Input {...register("collectionCode")} />
        </div>
      </div>

      <div className="space-y-2 border-t pt-4">
        <label className="text-sm font-medium">Observaciones / Comentarios</label>
        <Input {...register("occurrenceRemarks")} placeholder="Detalles extra del avistamiento." />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline">
          <Link href="/dashboard/occurrences">Cancelar</Link>
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Guardando..." : id ? "Guardar Cambios" : "Registrar"}
        </Button>
      </div>
    </form>
  );
}
