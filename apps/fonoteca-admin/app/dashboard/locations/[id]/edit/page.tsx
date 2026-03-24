import { LocationForm } from "@/components/dashboard/locations/location-form";

export default async function EditLocationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="container mx-auto space-y-4 py-6">
      <h1 className="text-3xl font-bold tracking-tight">Editar Ubicación</h1>
      <p className="text-muted-foreground">Actualiza los datos del área geográfica seleccionada.</p>
      <LocationForm id={id} />
    </div>
  );
}
