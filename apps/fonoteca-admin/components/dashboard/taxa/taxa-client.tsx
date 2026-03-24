"use client"

import { useState } from "react";
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
import { deleteTaxon } from "@/actions/taxa";
import { DeleteButtonWithConfirm } from "@/components/dashboard/delete-button-with-confirm";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { PageHeader } from "@/components/panel-admin/page-header";

export function TaxaClient({ data, count }: { data: Taxon[]; count: number }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [selectedTaxonId, setSelectedTaxonId] = useState<string | null>(null);

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

      <div className="flex items-center justify-between gap-4">

        <SearchInput placeholder="Buscar por nombre científico, familia, etc." />
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
