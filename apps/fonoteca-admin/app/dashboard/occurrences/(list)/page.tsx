import { getOccurrences, deleteOccurrence } from "@/actions/occurrences";
import { DeleteButtonWithConfirm } from "@/components/dashboard/delete-button-with-confirm";
import { PaginationButtons } from "@/components/dashboard/pagination-buttons";
import { SearchInput } from "@/components/dashboard/search-input";
import { buttonVariants } from "@/components/ui/button-variants";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Edit } from "lucide-react";
import Link from "next/link";

export default async function OccurrencesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const search = typeof params.search === "string" ? params.search : "";

  const { data: occurrences, count, error } = await getOccurrences({
    page,
    limit: 10,
    search,
  });

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <SearchInput placeholder="Buscar por código u observador..." />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Occurrence ID</TableHead>
              <TableHead>Taxón</TableHead>
              <TableHead>Ubicación</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Registrado Por</TableHead>
              <TableHead className="w-[100px]">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {occurrences.length > 0 ? (
              occurrences.map((oc) => (
                <TableRow key={oc.id}>
                  <TableCell className="font-medium">{oc.occurrenceID}</TableCell>
                  <TableCell className="italic">{oc.taxon?.scientificName || "Desconocido"}</TableCell>
                  <TableCell>{oc.location?.locality || "Desconocida"}</TableCell>
                  <TableCell>{oc.eventDate}</TableCell>
                  <TableCell>{oc.recordedBy}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Link href={`/dashboard/occurrences/${oc.id}`} className={buttonVariants({ variant: "ghost", size: "icon" })} title="Ver Detalles">
                        <Plus className="h-4 w-4 rotate-45" /> {/* Eye or any view icon */}
                      </Link>
                      <Link href={`/dashboard/occurrences/${oc.id}/edit`} className={buttonVariants({ variant: "ghost", size: "icon" })} title="Editar">
                        <Edit className="h-4 w-4" />
                      </Link>
                      <DeleteButtonWithConfirm
                        id={oc.id}
                        onConfirm={deleteOccurrence}
                        itemName="ocurrencia / registro"
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
    </>
  );
}

