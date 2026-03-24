import { LayoutWrapper } from "@/components/panel-admin/layout-wrapper"

interface ProfileLayoutProps {
    children: React.ReactNode
}

export default async function ProfileLayout({
    children,
}: ProfileLayoutProps) {



    return (
        <LayoutWrapper
            sectionTitle="Informacion general"
        >
            {children}
        </LayoutWrapper>
    )
}
