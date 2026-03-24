import { getLocations } from "@/actions/locations";
import { PaginationButtons } from "@/components/dashboard/pagination-buttons";
import { SearchInput } from "@/components/dashboard/search-input";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default async function LocationsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const search = typeof params.search === "string" ? params.search : "";

  const { data: locations, count, error } = await getLocations({
    page,
    limit: 10,
    search,
  });

  return (
    <div className="container mx-auto space-y-4 py-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Ubicaciones</h1>
          <p className="text-muted-foreground">
            Gestión de lugares para las ocurrencias monitoreadas.
          </p>
        </div>
        <Link href="/dashboard/locations/create" className={cn(buttonVariants({ variant: "default" }), "gap-2")}>
          <Plus className="h-4 w-4" /> Registrar Ubicación
        </Link>
      </div>

      <div className="flex items-center justify-between gap-4">
        <SearchInput placeholder="Buscar por localidad, provincia, etc." />
      </div>

      {error && <div className="text-red-500">{error}</div>}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Localidad</TableHead>
              <TableHead>Estado/Provincia</TableHead>
              <TableHead>País</TableHead>
              <TableHead>Coordenadas</TableHead>
              <TableHead className="w-[100px]">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {locations.length > 0 ? (
              locations.map((loc) => (
                <TableRow key={loc.id}>
                  <TableCell className="font-medium">{loc.locality}</TableCell>
                  <TableCell>{loc.stateProvince || "-"}</TableCell>
                  <TableCell>{loc.country}</TableCell>
                  <TableCell>
                    {loc.decimalLatitude && loc.decimalLongitude
                      ? `${loc.decimalLatitude}, ${loc.decimalLongitude}`
                      : "-"}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Link href={`/dashboard/locations/${loc.id}/edit`} className={buttonVariants({ variant: "ghost", size: "icon" })} title="Editar">
                        <Edit className="h-4 w-4" />
                      </Link>
                      <Button variant="ghost" className="text-destructive hover:text-destructive" size="icon" title="Eliminar">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
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
