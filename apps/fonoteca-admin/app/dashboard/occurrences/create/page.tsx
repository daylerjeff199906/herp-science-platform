import { OccurrenceForm } from "@/components/dashboard/occurrences/occurrence-form";

export default function CreateOccurrencePage() {
  return (
    <div className="w-full max-w-7xl mx-auto space-y-4 py-6 px-4">
      <h1 className="text-3xl font-bold tracking-tight">Registrar Ocurrencia</h1>
      <p className="text-muted-foreground">Monitoreo de especies avistadas en ubicaciones registradas.</p>
      <OccurrenceForm />
    </div>
  );
}
