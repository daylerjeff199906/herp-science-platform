"use client"

import { useState, useEffect } from "react";
import { Taxon } from "@/types/fonoteca";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/dashboard/search-input";
import { PaginationButtons } from "@/components/dashboard/pagination-buttons";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { TaxonForm } from "./taxon-form";
import { deleteTaxon, getFamilies, getGenera } from "@/actions/taxa";
import { DeleteButtonWithConfirm } from "@/components/dashboard/delete-button-with-confirm";
import { useRouter, useSearchParams } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { PageHeader } from "@/components/panel-admin/page-header";

export function TaxaClient({ data, count }: { data: Taxon[]; count: number }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const [selectedTaxonId, setSelectedTaxonId] = useState<string | null>(null);

  const [families, setFamilies] = useState<any[]>([]);
  const [genera, setGenera] = useState<any[]>([]);

  useEffect(() => {
    getFamilies().then(res => setFamilies(res.data || []));
    getGenera().then(res => setGenera(res.data || []));
  }, []);

  const currentKingdom = searchParams.get("kingdom") || "all";
  const currentFamily = searchParams.get("family_id") || "all";
  const currentGenus = searchParams.get("genus_id") || "all";

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  };

  const handleCreate = () => {
    setSelectedTaxonId(null);
    setOpen(true);
  };

  const handleEdit = (id: string) => {
    setSelectedTaxonId(id);
    setOpen(true);
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title="Catálogo de Taxones"
        description="Gestión de familias, géneros y especies para las ocurrencias."
        action={{
          label: "Registrar Taxón",
          onClick: handleCreate,
          icon: <Plus className="h-4 w-4" />,
        }}
      />

      <div className="flex flex-wrap items-center gap-2">
        <div className="flex-1 min-w-[200px]">
          <SearchInput placeholder="Buscar por nombre científico..." />
        </div>

        <Select value={currentKingdom} onValueChange={(val) => handleFilterChange("kingdom", val)}>
          <SelectTrigger className="w-[140px] h-9 text-xs shadow-sm bg-background">
            <SelectValue placeholder="Reino" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">📁 Todos: Reinos</SelectItem>
            <SelectItem value="Animalia">Animalia</SelectItem>
            <SelectItem value="Plantae">Plantae</SelectItem>
            <SelectItem value="Fungi">Fungi</SelectItem>
          </SelectContent>
        </Select>

        <Select value={currentFamily} onValueChange={(val) => handleFilterChange("family_id", val)}>
          <SelectTrigger className="w-[160px] h-9 text-xs shadow-sm bg-background">
            <SelectValue placeholder="Familia" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">📁 Todas: Familias</SelectItem>
            {families.map((f) => (
              <SelectItem key={f.id} value={f.id} className="text-xs">{f.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={currentGenus} onValueChange={(val) => handleFilterChange("genus_id", val)}>
          <SelectTrigger className="w-[160px] h-9 text-xs shadow-sm bg-background">
            <SelectValue placeholder="Género" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">📁 Todos: Géneros</SelectItem>
            {genera.map((g) => (
              <SelectItem key={g.id} value={g.id} className="text-xs">{g.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre Científico</TableHead>
              <TableHead>Reino</TableHead>
              <TableHead>Familia</TableHead>
              <TableHead>Género</TableHead>
              <TableHead>Rango</TableHead>
              <TableHead className="w-[100px]">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length > 0 ? (
              data.map((taxon) => (
                <TableRow key={taxon.id}>
                  <TableCell className="font-medium italic">{taxon.scientificName}</TableCell>
                  <TableCell>{taxon.genus?.family?.kingdom || "Animalia"}</TableCell>
                  <TableCell>{taxon.genus?.family?.name || "-"}</TableCell>
                  <TableCell>{taxon.genus?.name || "-"}</TableCell>
                  <TableCell>{taxon.taxonRank}</TableCell>
                  <TableCell>

                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(taxon.id)} title="Editar">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <DeleteButtonWithConfirm
                        id={taxon.id}
                        onConfirm={deleteTaxon}
                        itemName="taxón"
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No se encontraron resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <PaginationButtons totalCount={count} pageSize={10} />

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="overflow-y-auto md:min-w-[60vw] max-w-5xl">
          <SheetHeader className="pb-0">
            <SheetTitle>{selectedTaxonId ? "Editar Taxón" : "Registrar Taxón"}</SheetTitle>
          </SheetHeader>
          <div className="px-4 py-0 min-w-5xl">
            <TaxonForm id={selectedTaxonId} onSuccess={() => { setOpen(false); router.refresh(); }} />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
