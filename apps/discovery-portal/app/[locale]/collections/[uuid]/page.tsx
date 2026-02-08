import { getTranslations } from "next-intl/server";
import { fetchIndividualByUuid } from '@repo/networking'
import { Params } from "@repo/shared-types";

interface CollectionPageProps {
    params: Params
}

export default async function CollectionPage(props: CollectionPageProps) {
    const params = await props.params;
    const uuid = await params.uuid as string;
    const t = await getTranslations('Collections.Collection');

    const individual = await fetchIndividualByUuid(uuid);

    if (!individual) {
        return (
            <div>
                <h1>{t('notFound')}</h1>
            </div>
        )
    }

    return (
        <div>
            <h1>{t('title')}</h1>
        </div>
    );
}