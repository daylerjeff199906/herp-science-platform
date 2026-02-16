import { LayoutWrapper } from "@/components/layout-wrapper";
import { PageHeader } from "@/components/page-header";
import { fetchSexes, fetchMuseums } from '@repo/networking';
import { ROUTES } from "@/config";

export default async function Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [sexes, museums] = await Promise.all([
        fetchSexes({ page: 1, pageSize: 100 }),
        fetchMuseums({ page: 1, pageSize: 100 }),
    ]);

    // TODO: Implementar servicios para activities y forestTypes
    const activities = { data: [] };
    const forestTypes = { data: [] };

    return (
        <LayoutWrapper
            sectionTitle="Crear Individuo"
            breadcrumbs={[
                { title: 'Dashboard', href: '/dashboard' },
                { title: 'Individuos', href: ROUTES.CORE.INDIVIDUALS },
                { title: 'Crear' },
            ]}
        >
            <PageHeader
                title="Crear Individuo"
                description="Crea un nuevo individuo en el sistema."
            />
            {children}
        </LayoutWrapper>
    );
}
