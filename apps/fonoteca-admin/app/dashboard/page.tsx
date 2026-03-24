export default function DashboardPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Panel de Administración de Fonoteca</h1>
      <p className="text-gray-600">
        Bienvenido al módulo administrativo. Desde aquí podrás gestionar las especies,
        la carga de audios y visualizar los metadatos de las grabaciones de campo.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="p-4 border rounded-lg shadow-sm">
          <h2 className="font-semibold text-lg">Especies</h2>
          <p className="text-sm text-gray-500">Manejar catálogo de taxonomía</p>
        </div>
        <div className="p-4 border rounded-lg shadow-sm">
          <h2 className="font-semibold text-lg">Audios</h2>
          <p className="text-sm text-gray-500">Subidas de grabaciones de campo</p>
        </div>
        <div className="p-4 border rounded-lg shadow-sm">
          <h2 className="font-semibold text-lg">Metadatos</h2>
          <p className="text-sm text-gray-500">Detalles y coordenadas de GPS</p>
        </div>
      </div>
    </div>
  );
}
