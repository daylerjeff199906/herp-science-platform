'use client';

import { AdvancedFilterHorizontal } from '@/components/miscellaneous/advanced-filter-horizontal';

export function CountriesFilter() {
    return (
        <AdvancedFilterHorizontal
            filters={[]}
            searchFields={[{ key: 'name', label: 'Nombre' }]}
            hiddenMoreFiltersButton={true}
            hiddenBadgeFilters={true}
        />
    );
}
