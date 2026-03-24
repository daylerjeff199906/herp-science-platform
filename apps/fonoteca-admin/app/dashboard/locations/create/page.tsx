import { LocationForm } from "@/components/dashboard/locations/location-form";

export default function CreateLocationPage() {
  return (
    <div className="container mx-auto space-y-4 py-6">
      <h1 className="text-3xl font-bold tracking-tight">Registrar Ubicación</h1>
      <p className="text-muted-foreground">Revisa los campos para asegurar la precisión de la geografía.</p>
      <LocationForm />
    </div>
  );
}
