import { getOccurrences, deleteOccurrence } from "@/actions/occurrences";
import { getTaxa } from "@/actions/taxa";
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
import { Edit, Eye, Music, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { OccurrenceFilters } from "@/components/dashboard/occurrences/occurrence-filters";
import { getDriveThumbnailUrl } from "@/utils/multimedia";

export default async function OccurrencesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const search = typeof params.search === "string" ? params.search : "";
  const taxonId = typeof params.taxonId === "string" ? params.taxonId : "";
  const hasImage = typeof params.hasImage === "string" ? params.hasImage : "all";
  const hasAudio = typeof params.hasAudio === "string" ? params.hasAudio : "all";

  const [{ data: occurrences, count, error }, { data: taxa }] = await Promise.all([
    getOccurrences({
      page,
      limit: 10,
      search,
      taxonId,
      hasImage,
      hasAudio,
    }),
    getTaxa({ limit: 1000 }) // Load all taxa for filtering
  ]);

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4">
          <SearchInput placeholder="Buscar por código u observador..." />
        </div>
        
        <OccurrenceFilters taxa={taxa || []} />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Media</TableHead>
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
              occurrences.map((oc) => {
                const stillImage = oc.multimedia?.find(m => m.type === 'Still');
                const hasSound = oc.multimedia?.some(m => m.type === 'Sound');
                const thumbUrl = stillImage ? (getDriveThumbnailUrl(stillImage.identifier) || stillImage.identifier) : null;

                return (
                  <TableRow key={oc.id}>
                    <TableCell>
                      <div className="flex items-center gap-1.5 min-w-[60px]">
                        {thumbUrl ? (
                          <div className="h-8 w-8 rounded overflow-hidden border bg-muted">
                            <img src={thumbUrl} className="h-full w-full object-cover" alt="Thumb" />
                          </div>
                        ) : (
                          <div className="h-8 w-8 rounded border bg-muted/30 flex items-center justify-center">
                            <ImageIcon className="h-3.5 w-3.5 text-muted-foreground/50" />
                          </div>
                        )}
                        {hasSound && (
                          <div title="Tiene Audio" className="p-1 rounded-full bg-blue-50 text-blue-600">
                             <Music className="h-3 w-3" />
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{oc.occurrenceID}</TableCell>
                    <TableCell className="italic">{oc.taxon?.scientificName || "Desconocido"}</TableCell>
                    <TableCell>{oc.location?.locality || "Desconocida"}</TableCell>
                    <TableCell>{oc.eventDate}</TableCell>
                    <TableCell>{oc.recordedBy}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Link href={`/dashboard/occurrences/${oc.id}`} className={buttonVariants({ variant: "ghost", size: "icon" })} title="Ver Detalles">
                          <Eye className="h-4 w-4" />
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
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
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

