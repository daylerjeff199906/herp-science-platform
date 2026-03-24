import { getMultimediaList } from "@/actions/multimedia";
import { PaginationButtons } from "@/components/dashboard/pagination-buttons";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Edit, Trash2, } from "lucide-react";
import Link from "next/link";

export default async function MultimediaPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const type = typeof params.type === "string" ? params.type : "";

  const { data: multimedia, count, error } = await getMultimediaList({
    page,
    limit: 10,
    type,
  });

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto space-y-4 py-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Archivos Multimedia</h1>
          <p className="text-muted-foreground">
            Gestión de grabaciones o audios relativos a las ocurrencias.
          </p>
        </div>
        <Button asChild className="gap-2">
          <Link href="/dashboard/multimedia/create">
            <Plus className="h-4 w-4" /> Subir Archivo
          </Link>
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Formato</TableHead>
              <TableHead>Creador</TableHead>
              <TableHead>Ocurrencia / Taxón</TableHead>
              <TableHead className="w-[100px]">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {multimedia.length > 0 ? (
              multimedia.map((media) => (
                <TableRow key={media.id}>
                  <TableCell className="font-medium">{media.title || "Sin Título"}</TableCell>
                  <TableCell className="capitalize">{media.type}</TableCell>
                  <TableCell>{media.format}</TableCell>
                  <TableCell>{media.creator}</TableCell>
                  <TableCell>
                    {media.occurrence?.taxon?.scientificName ? (
                        <span className="italic">{media.occurrence?.taxon?.scientificName}</span>
                    ) : "General"}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" asChild title="Editar">
                        <Link href={`/dashboard/multimedia/${media.id}/edit`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button variant="ghost" className="text-destructive hover:text-destructive" size="icon" title="Eliminar">
                        <Trash2 className="h-4 w-4" />
                      </Button>
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
    </div>
  );
}
