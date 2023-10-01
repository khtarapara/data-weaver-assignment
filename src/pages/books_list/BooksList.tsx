import React, { useCallback, useEffect, useState } from "react";
import type { TablePaginationConfig } from "antd/es/table";
import { Input } from "antd";
import type { SearchProps } from "antd/es/input";
import { useAppDispatch } from "../../store/hooks";
import { fetchBooks as fetchBooksThunk } from "../../store/bookThunks";
import { Book } from "../../models/book";
import { FilterValue, SorterResult } from "antd/es/table/interface";
import AddBookModal from "./AddBookModal";

import styles from "./BooksList.module.css";
import BooksTable from "./BooksTable";
import { TableParams, onSearchEvent, onSearchInfo } from "./types";

const defaultSortBy = "id";
const defaultSortOrder = "DESC";

function BooksList() {
  const dispatch = useAppDispatch();
  const [filter, setFilter] = useState<string>("");
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
    },
    sortBy: "id",
    sortOrder: "DESC",
  });

  const handleTableChange = useCallback(
    (
      pagination: TablePaginationConfig,
      _filters: Record<string, FilterValue | null>,
      sorter: SorterResult<Book> | SorterResult<Book>[]
    ) => {
      setTableParams({
        pagination,
        sortBy: (sorter as SorterResult<Book>).field as string,
        sortOrder:
          (sorter as SorterResult<Book>).order === "ascend" ? "ASC" : "DESC",
      });
    },
    []
  );

  const fetchBooks = useCallback(() => {
    dispatch(
      fetchBooksThunk({
        page: tableParams.pagination?.current || 1,
        pageSize: tableParams.pagination?.pageSize || 10,
        title: filter,
        sortBy: tableParams.sortBy || defaultSortBy,
        DIR: tableParams.sortOrder || defaultSortOrder,
      })
    );
  }, [
    dispatch,
    filter,
    tableParams.pagination,
    tableParams.sortBy,
    tableParams.sortOrder,
  ]);

  const handleSearch: SearchProps["onSearch"] = useCallback(
    (value: string, _e?: onSearchEvent, info?: onSearchInfo): void => {
      if (info && info.source === "input") {
        setFilter(value);
      }
    },
    []
  );

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  return (
    <div className={styles.booksList}>
      <AddBookModal onAdd={fetchBooks} />
      <Input.Search
        className={styles.search}
        onSearch={handleSearch}
        allowClear
        size="large"
      />
      <BooksTable
        onChange={handleTableChange}
        fetchBooks={fetchBooks}
        tableParams={tableParams}
      />
    </div>
  );
}

export default BooksList;
