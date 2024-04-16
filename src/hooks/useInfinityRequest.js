import { useCallback, useMemo, useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import {useInfiniteQuery} from "@tanstack/react-query";
import appAxios from "@/utils/axios.js";

const useInfinityRequest = (_params) => {
    const [take] = useState(50);
    const [order, setOrder] = useState(null);
    const [sortBy, setSortBy] = useState("");
    const [search, setSearch] = useState("");
    const [searchBy, setSearchBy] = useState(null);

    const debouncedSearch = useDebounce(search, 500);

    const {
        data,
        isFetching,
        isError,
        error,
        refetch,
        hasNextPage,
        fetchNextPage
    } = useInfiniteQuery({
        enabled: _params.enabled,
        queryKey: [_params.queryKey, debouncedSearch, order],
        keepPreviousData: _params.keepPreviousData,
        queryFn: async ({pageParam = 1}) => {
            if (pageParam === false) pageParam = 1;

            const params = {
                ..._params.params || {},
                take,
                skip: take * pageParam - take
            };

            if(searchBy) params.search_by = searchBy;

            if (search && search.length >= 3) {
                params.search = search
            }

            if (order && sortBy) {
                params.order = order;
                params.sort_by = sortBy;
            }

            const {data} = await appAxios.get(_params.url, {params})
            return {...data.data, prevPage: pageParam}
        },
        getNextPageParam: (lastPage) => {
            if (!lastPage.prevPage || (take * lastPage.prevPage >= lastPage.total)) return null;
            return lastPage.prevPage + 1;
        }
    });

    const objects = useMemo(() => {
        return data?.pages.flatMap(page => page[_params.key]) || [];
    }, [data]);

    const onSearch = useCallback((field, value) => {
        setSearchBy(field);
        setSearch(value);
    }, []);

    const onSort = useCallback((field) => {
        setOrder(order === 'asc' ? 'desc' : 'asc');
        setSortBy(field);
    }, [order]);

    return {
        data,
        objects,
        isFetching,
        isError,
        error,
        refetch,
        hasNextPage,
        fetchNextPage,
        onSearch,
        onSort,
        sortBy,
        order,
        search,
        searchBy
    }
}

export default useInfinityRequest;