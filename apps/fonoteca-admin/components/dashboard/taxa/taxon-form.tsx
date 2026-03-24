"use client"

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { taxonSchema, TaxonInput } from "@/lib/validations/fonoteca";
import { getTaxon, createTaxon, updateTaxon, getGenera } from "@/actions/taxa";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function TaxonForm({ id, onSuccess }: { id: string | null; onSuccess: () => void }) {
  const [loading, setLoading] = useState(false);
  const [genera, setGenera] = useState<any[]>([]);
  const [openCombobox, setOpenCombobox] = useState(false);

  const form = useForm<TaxonInput>({
    resolver: zodResolver(taxonSchema),
    defaultValues: {
      scientificName: "",
      taxonRank: "species",
      nomenclaturalCode: "ICZN",
      genus_id: "",
    }
  });

  const { reset, handleSubmit } = form;

  useEffect(() => {
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
    return <div className="text-center py-4 text-sm text-muted-foreground">Cargando datos...</div>;
  }

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Sección: Información Científica */}
        <div className="space-y-4">
          <div className="border-b pb-2">
            <h3 className="text-sm font-semibold text-foreground">Información Científica</h3>
            <p className="text-xs text-muted-foreground">Define nombre y rango del taxón.</p>
          </div>

          <FormField
            control={form.control}
            name="scientificName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre Científico *</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="p. ej. Leptodactylus leptodactyloides" className="font-medium italic" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="genus_id"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="mb-px leading-6">Género (Familia) *</FormLabel>
                  <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={openCombobox}
                          className={cn(
                            "w-full justify-between font-normal text-sm h-10 px-3",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? (() => {
                                const g = genera.find((g) => g.id === field.value);
                                return g ? `${g.name} (${g.family?.name || "Sin Familia"})` : "Seleccionar Género";
                              })()
                            : "Seleccionar Género"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                      <Command>
                        <CommandInput placeholder="Buscar género..." className="h-9" />
                        <CommandList className="max-h-[250px]">
                          <CommandEmpty>No se encontraron géneros.</CommandEmpty>
                          <CommandGroup>
                            {genera.map((g) => (
                              <CommandItem
                                key={g.id}
                                value={`${g.name} ${g.family?.name || ""}`}
                                onSelect={() => {
                                  form.setValue("genus_id", g.id);
                                  form.clearErrors("genus_id");
                                  setOpenCombobox(false);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    g.id === field.value ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                <div className="flex flex-col">
                                  <span className="font-medium">{g.name}</span>
                                  <span className="text-xs text-muted-foreground">
                                    {g.family?.name || "Sin Familia"}
                                  </span>
                                </div>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="taxonRank"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rango Taxonómico</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="species" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Sección: Epítetos */}
        <div className="space-y-4">
          <div className="border-b pb-2">
            <h3 className="text-sm font-semibold text-foreground">Epítetos</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="specificEpithet"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Epíteto Específico</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value || ""} placeholder="..." />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="infraspecificEpithet"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Epíteto Infraspecífico</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value || ""} placeholder="..." />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Sección: Nombres y Autoría */}
        <div className="space-y-4">
          <div className="border-b pb-2">
            <h3 className="text-sm font-semibold text-foreground">Nombres Comunes y Autoría</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="vernacularName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre Común/Vernacular</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value || ""} placeholder="Nombre local..." />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="scientificNameAuthorship"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Autoría (Cita)</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value || ""} placeholder="p. ej. Boulenger, 1898" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          -- no-op --
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button type="submit" disabled={loading} className="min-w-[120px]">
            {loading ? "Guardando..." : id ? "Guardar Cambios" : "Registrar"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
