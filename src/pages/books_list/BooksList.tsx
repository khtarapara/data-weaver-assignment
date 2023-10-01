import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Table as AntdTable } from "antd";
import type { TablePaginationConfig } from "antd/es/table";
import { Input } from "antd";
import styles from "./BooksList.module.css";
import type { SearchProps } from "antd/es/input";
import { usePagination } from "../../hooks/usePagination";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchBooks } from "../../store/bookThunks";

const Table = React.memo(AntdTable);

type onSearchInfo = {
  source?: "clear" | "input";
};

type onSearchEvent =
  | React.ChangeEvent<HTMLInputElement>
  | React.MouseEvent<HTMLElement>
  | React.KeyboardEvent<HTMLInputElement>;

function BooksList() {
  const { books, total, loading, error } = useAppSelector(
    (state) => state.books
  );
  const dispatch = useAppDispatch();
  const [filter, setFilter] = useState<string>("");
  const {
    pagination,
    handleChange: handlePaginationChange,
    handleTotalChange,
  } = usePagination();

  const handleTableChange = useCallback(
    (pagination: TablePaginationConfig) => {
      handlePaginationChange(
        pagination.current || 1,
        pagination.pageSize || 10
      );
    },
    [handlePaginationChange]
  );

  const columns = useMemo(
    () => [
      {
        title: "Title",
        dataIndex: "title",
      },
      {
        title: "Author",
        dataIndex: "author",
      },
      {
        title: "Year",
        dataIndex: "year",
      },
      {
        title: "Language",
        dataIndex: "language",
      },
      {
        title: "Country",
        dataIndex: "country",
      },
      {
        title: "Pages",
        dataIndex: "pages",
      },
      {
        title: "Link",
        dataIndex: "link",
      },
    ],
    []
  );

  const handleSearch: SearchProps["onSearch"] = useCallback(
    (value: string, _e?: onSearchEvent, info?: onSearchInfo): void => {
      if (info && info.source === "input") {
        setFilter(value);
      }
    },
    []
  );

  useEffect(() => {
    dispatch(
      fetchBooks({
        page: pagination.currentPage,
        pageSize: pagination.pageSize,
        title: filter,
      })
    );
  }, [
    dispatch,
    filter,
    handleTotalChange,
    pagination.currentPage,
    pagination.pageSize,
  ]);

  useEffect(() => {
    handleTotalChange(total);
  }, [total, handleTotalChange]);

  return (
    <div className={styles.booksList}>
      <Input.Search
        className={styles.search}
        onSearch={handleSearch}
        allowClear
        size="large"
      />
      {error}
      <Table
        bordered
        className={styles.table}
        columns={columns}
        rowKey={(record) => record.id}
        dataSource={books}
        pagination={{
          ...pagination,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} records`,
          showSizeChanger: true,
          position: ["topCenter", "bottomCenter"],
        }}
        onChange={handleTableChange}
        loading={loading}
      />
    </div>
  );
}

export default BooksList;
