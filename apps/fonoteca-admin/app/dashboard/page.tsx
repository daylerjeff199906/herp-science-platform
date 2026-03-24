import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarTrigger,
} from "@/components/ui/sidebar"

export default function Page() {
  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-vertical:h-4 data-vertical:self-auto"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">
                  Fonoteca
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Resumen General</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          <div className="aspect-video rounded-xl bg-muted/50 flex items-center justify-center p-6">
            <div className="text-center">
              <h3 className="font-semibold text-lg">Taxonomía</h3>
              <p className="text-sm text-muted-foreground">Gestión de especies y clasificación biológica.</p>
            </div>
          </div>
          <div className="aspect-video rounded-xl bg-muted/50 flex items-center justify-center p-6">
            <div className="text-center">
              <h3 className="font-semibold text-lg">Ubicaciones</h3>
              <p className="text-sm text-muted-foreground">Registro de margenes geográficos y hábitats.</p>
            </div>
          </div>
          <div className="aspect-video rounded-xl bg-muted/50 flex items-center justify-center p-6">
            <div className="text-center">
              <h3 className="font-semibold text-lg">Monitoreo</h3>
              <p className="text-sm text-muted-foreground">Eventos de observación y registro biológico.</p>
            </div>
          </div>
        </div>
        <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min flex items-center justify-center">
          <p className="text-muted-foreground">Seleccione un módulo en el panel izquierdo para comenzar.</p>
        </div>
      </div>
    </>
  )
}
