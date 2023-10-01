import { useCallback, useState } from "react";

export interface Pagination {
  currentPage: number;
  pageSize: number;
  total?: number;
}

export function usePagination(initialState?: Pagination) {
  const [pagination, setPagination] = useState<Pagination>(
    initialState
      ? initialState
      : {
          currentPage: 1,
          pageSize: 10,
        }
  );

  const handleChange = useCallback((currentPage: number, pageSize: number) => {
    setPagination((p) => ({
      ...p,
      currentPage,
      pageSize,
    }));
  }, []);

  const handleTotalChange = useCallback((total: number) => {
    setPagination((p) => ({
      ...p,
      total,
    }));
  }, []);

  return {
    pagination,
    handleChange,
    handleTotalChange,
  };
}
