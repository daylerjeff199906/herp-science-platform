import { useQuery } from "@tanstack/react-query";

interface EntityWithId {
    id: number | string;
    [key: string]: any;
}

/**
 * Maps a list of objects with { id, [labelKey] } to select options.
 */
export const mapToOptions = <T extends EntityWithId>(data: T[] | undefined, labelKey: keyof T = 'name') => {
    if (!data) return [];
    return data.map((i) => ({ label: String(i[labelKey]), value: i.id.toString() }));
};

/**
 * Custom hook to fetch or use an initial option for a select component.
 * This is useful when we need to show the selected item's label even if it's not in the initial paginated list.
 */
export const useInitialOption = <T extends EntityWithId>(
    id: string | null | undefined,
    fetchFn: (id: string) => Promise<T>,
    queryKeyBase: string,
    initialList: T[] | undefined,
    labelKey: keyof T = 'name'
) => {
    const { data } = useQuery({
        queryKey: [queryKeyBase, id],
        queryFn: () => {
            if (!id) throw new Error("ID is required");
            return fetchFn(id);
        },
        // Only fetch if ID exists AND the item is NOT already in the initial list we have loaded
        enabled: !!id && !initialList?.find((i) => String(i.id) === id),
        staleTime: Infinity,
    });

    // If found in initial list, use it
    const foundInList = initialList?.find((i) => String(i.id) === id);
    if (foundInList) {
        return [{ label: String(foundInList[labelKey]), value: foundInList.id.toString() }];
    }

    // Otherwise use fetched individual item
    return data ? [{ label: String(data[labelKey]), value: data.id.toString() }] : [];
};
