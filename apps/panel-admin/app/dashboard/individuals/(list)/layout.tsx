import { LayoutWrapper } from "@/components/layout-wrapper";
import { PageHeader } from "@/components/page-header";

export default function Layout({
    children,
}: {
    children: React.ReactNode;
}) {
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
            />
            {children}
        </LayoutWrapper>
    );
}
