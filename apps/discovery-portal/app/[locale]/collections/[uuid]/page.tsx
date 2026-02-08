
import { getTranslations } from "next-intl/server";
import { fetchIndividualByUuid } from '@repo/networking'
import { Params } from "@repo/shared-types";
import { IndividualDetailView } from '@/components/collections/detail/IndividualDetailView';
import { Metadata } from 'next';

interface CollectionPageProps {
    params: Promise<Params>
}

export async function generateMetadata({ params }: CollectionPageProps): Promise<Metadata> {
    const { uuid } = await params;
    const individual = await fetchIndividualByUuid(uuid as string);
    const t = await getTranslations('Collections.Detail');

    if (!individual) {
        return {
            title: t('notFound'),
        }
    }

    return {
        title: `${individual.species.scientificName} | ${t('title')}`,
        description: `${individual.species.commonName || individual.species.scientificName} - ${t('record')}: ${individual.code || 'N/A'}`,
        openGraph: {
            images: individual.files.images?.[0]?.name ? [individual.files.images[0].name] : [],
        }
    }
}

export default async function CollectionPage({ params }: CollectionPageProps) {
    const { uuid } = await params;

    // Fetch individual details
    const individual = await fetchIndividualByUuid(uuid as string);
    const t = await getTranslations('Collections.Detail');

    if (!individual) {
        return (
            <div className="container mx-auto py-24 text-center">
                <h1 className="text-2xl font-bold text-gray-900">{t('notFound')}</h1>
            </div>
        )
    }

    return <IndividualDetailView individual={individual} />;
}