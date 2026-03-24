import { OccurrenceForm } from "@/components/dashboard/occurrences/occurrence-form";

export default async function EditOccurrencePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="container mx-auto space-y-4 py-6">
      <h1 className="text-3xl font-bold tracking-tight">Editar Ocurrencia</h1>
      <p className="text-muted-foreground">Actualiza los datos del monitoreo seleccionado.</p>
      <OccurrenceForm id={id} />
    </div>
  );
}
