import { LayoutWrapper } from "@/components/layout-wrapper";
import { PageHeader } from "@/components/page-header";
import { fetchSexes, fetchMuseums } from '@repo/networking';
import { IndividualsFilter } from "./components/individuals-filter";
import { CreateIndividualButton } from "./components/create-individual-button";

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
            sectionTitle="Gestión de Individuos"
            breadcrumbs={[
                { title: 'Dashboard', href: '/dashboard' },
                { title: 'Principal', href: '#' },
                { title: 'Individuos' },
            ]}
        >
            <PageHeader
                title="Individuos"
                description="Administra el registro de individuos del sistema."
                actions={<CreateIndividualButton />}
            />
            <IndividualsFilter
                sexes={sexes.data}
                activities={activities.data}
                museums={museums.data}
                forestTypes={forestTypes.data}
            />
            {children}
        </LayoutWrapper>
    );
}
