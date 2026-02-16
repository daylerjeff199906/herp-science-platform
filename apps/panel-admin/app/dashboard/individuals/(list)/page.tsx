import { fetchIndividuals } from '@/services/individuals';
import { fetchSexes, fetchMuseums } from '@repo/networking';
import { IndividualFilter } from '@repo/shared-types';
import { IndividualsView } from './components/individuals-view';

interface IPageProps {
    searchParams?: Promise<{
        page?: string;
        pageSize?: string;
        searchTerm?: string;
        sexId?: string;
        hasEggs?: string;
        activityId?: string;
        museumId?: string;
        forestTypeId?: string;
        orderBy?: string;
        orderType?: 'ASC' | 'DESC';
    }>;
}

export default async function Page(props: IPageProps) {
    const params = await props.searchParams;

    const filter: IndividualFilter = {
        page: params?.page ? Number(params.page) : 1,
        pageSize: params?.pageSize ? Number(params.pageSize) : 20,
        searchTerm: params?.searchTerm,
        sexId: params?.sexId ? Number(params.sexId) : undefined,
        hasEggs: params?.hasEggs ? Number(params.hasEggs) : undefined,
        activityId: params?.activityId ? Number(params.activityId) : undefined,
        museumId: params?.museumId ? Number(params.museumId) : undefined,
        forestTypeId: params?.forestTypeId ? Number(params.forestTypeId) : undefined,
        orderBy: params?.orderBy ? params.orderBy : 'id',
        orderType: params?.orderType ? params.orderType : 'DESC',
    };

    const [individuals, sexes, museums] = await Promise.all([
        fetchIndividuals(filter),
        fetchSexes({ page: 1, pageSize: 100 }),
        fetchMuseums({ page: 1, pageSize: 100 }),
    ]);

    // TODO: Implementar servicios para activities y forestTypes
    const activities = { data: [] };
    const forestTypes = { data: [] };

    return (
        <IndividualsView
            individuals={individuals}
            sexes={sexes.data}
            activities={activities.data}
            museums={museums.data}
            forestTypes={forestTypes.data}
        />
    );
}

export const dynamic = 'force-dynamic';
