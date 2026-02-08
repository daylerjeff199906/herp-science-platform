import { useQuery } from "@tanstack/react-query";

interface NamedEntity {
    id: number | string;
    name: string;
}

/**
 * Maps a list of objects with { id, name } to select options.
 */
export const mapToOptions = <T extends NamedEntity>(data: T[] | undefined) => {
    if (!data) return [];
    return data.map((i) => ({ label: i.name, value: i.id.toString() }));
};

/**
 * Custom hook to fetch or use an initial option for a select component.
 * This is useful when we need to show the selected item's label even if it's not in the initial paginated list.
 */
export const useInitialOption = <T extends NamedEntity>(
    id: string | null | undefined,
    fetchFn: (id: string) => Promise<T>,
    queryKeyBase: string,
    initialList: T[] | undefined
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
        return [{ label: foundInList.name, value: foundInList.id.toString() }];
    }

    // Otherwise use fetched individual item
    return data ? [{ label: data.name, value: data.id.toString() }] : [];
};
