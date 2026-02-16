import { LayoutWrapper } from "@/components/layout-wrapper";

export default function Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    <LayoutWrapper
        sectionTitle="Gestión de Individuos"
        breadcrumbs={[
            { title: 'Dashboard', href: '/dashboard' },
            { title: 'Principal', href: '#' },
            { title: 'Individuos' },
        ]}
    >
        {children}
    </LayoutWrapper>
}
