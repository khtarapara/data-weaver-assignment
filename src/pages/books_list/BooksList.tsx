import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Table as AntdTable } from "antd";
import type { TablePaginationConfig } from "antd/es/table";
import { Book, BooksAPI } from "../../models/book";
import { Input } from "antd";
import styles from "./BooksList.module.css";
import type { SearchProps } from "antd/es/input";

const Table = React.memo(AntdTable);

type onSearchInfo = {
  source?: "clear" | "input";
};

type onSearchEvent =
  | React.ChangeEvent<HTMLInputElement>
  | React.MouseEvent<HTMLElement>
  | React.KeyboardEvent<HTMLInputElement>;

interface TablePagination {
  currentPage: number;
  pageSize: number;
  total?: number;
}

function BooksList() {
  const [data, setData] = useState<Book[]>();
  const [loading, setLoading] = useState<boolean>(false);
  const [filter, setFilter] = useState<string>("");
  const [pagination, setPagination] = useState<TablePagination>({
    currentPage: 1,
    pageSize: 10,
  });

  const handleTableChange = useCallback((pagination: TablePaginationConfig) => {
    setPagination((p) => ({
      ...p,
      currentPage: pagination.current || 1,
      pageSize: pagination.pageSize || 10,
    }));
  }, []);

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
    const fetchData = async (filter: string, pagination: TablePagination) => {
      try {
        setLoading(true);
        const res = await fetch(
          `http://68.178.162.203:8080/application-test-v1.1/books?page=${pagination.currentPage}&pageSize=${pagination.pageSize}&title=${filter}`
        );
        const resData: BooksAPI = await res.json();

        setData(resData.data);
        setPagination({
          ...pagination,
          total: resData.pagination.totalElements,
        });
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData(filter, {
      currentPage: pagination.currentPage,
      pageSize: pagination.pageSize,
    });
  }, [filter, pagination.currentPage, pagination.pageSize]);

  return (
    <div className={styles.booksList}>
      <Input.Search
        className={styles.search}
        onSearch={handleSearch}
        allowClear
      />
      <Table
        bordered
        className={styles.table}
        columns={columns}
        rowKey={(record) => record.id}
        dataSource={data}
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
