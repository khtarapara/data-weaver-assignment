import React, {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Table as AntdTable, Button, InputNumber } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import { Input } from "antd";
import type { SearchProps } from "antd/es/input";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchBooks as fetchBooksThunk } from "../../store/bookThunks";
import { Book } from "../../models/book";
import { FilterValue, SorterResult } from "antd/es/table/interface";
import { updateBook } from "../../api";
import { CheckOutlined, CloseOutlined, EditOutlined } from "@ant-design/icons";
import AddBookModal from "./AddBookModal";

import styles from "./BooksList.module.css";

const Table = React.memo(AntdTable<Book>);

type onSearchInfo = {
  source?: "clear" | "input";
};

type onSearchEvent =
  | React.ChangeEvent<HTMLInputElement>
  | React.MouseEvent<HTMLElement>
  | React.KeyboardEvent<HTMLInputElement>;

interface TableParams {
  pagination?: TablePaginationConfig;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
  filters?: Record<string, FilterValue | null>;
}

const defaultSortBy = "id";
const defaultSortOrder = "DESC";

function BooksList() {
  const { books, total, loading, error } = useAppSelector(
    (state) => state.books
  );
  const dispatch = useAppDispatch();
  const [filter, setFilter] = useState<string>("");
  const [editableRowId, setEditableRowId] = useState<number>(0);
  const [form, setForm] = useState<Book | null>(null);
  const [updatePending, setUpdatePending] = useState<boolean>(false);
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
      filters: Record<string, FilterValue | null>,
      sorter: SorterResult<Book> | SorterResult<Book>[],
      extra: any
    ) => {
      console.log(pagination, filters, sorter, extra);
      setTableParams({
        pagination,
        filters,
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

  const handleEdit = useCallback((record: Book) => {
    setEditableRowId(record.id);
    setForm(record);
  }, []);

  const handleSave = useCallback(async () => {
    try {
      if (!form) {
        return;
      }
      setUpdatePending(true);
      await updateBook(form);
      fetchBooks();
    } catch (err) {
      console.log(err);
      // TODO: show toast.
    } finally {
      setUpdatePending(false);
      setEditableRowId(0);
      setForm(null);
    }
  }, [fetchBooks, form]);

  const handleCancel = useCallback(() => {
    setEditableRowId(0);
    setForm(null);
  }, []);

  const columns = useMemo<ColumnsType<Book>>(
    () => [
      {
        title: "Title",
        dataIndex: "title",
        sorter: true,
        render: (value: any, record: Book) => {
          return editableRowId === record.id ? (
            <Input
              defaultValue={value}
              disabled={updatePending}
              onChange={(e) =>
                setForm((f) => ({ ...(f as Book), title: e.target.value }))
              }
            />
          ) : (
            value
          );
        },
      },
      {
        title: "Author",
        dataIndex: "author",
        sorter: true,
        render: (value: any, record: Book) => {
          return editableRowId === record.id ? (
            <Input
              defaultValue={value}
              disabled={updatePending}
              onChange={(e) =>
                setForm((f) => ({ ...(f as Book), author: e.target.value }))
              }
            />
          ) : (
            value
          );
        },
      },
      {
        title: "Year",
        dataIndex: "year",
        sorter: true,
        render: (value: any, record: Book) => {
          return editableRowId === record.id ? (
            <InputNumber
              defaultValue={value}
              disabled={updatePending}
              onChange={(value) =>
                setForm((f) => ({ ...(f as Book), year: value }))
              }
            />
          ) : (
            value
          );
        },
      },
      {
        title: "Language",
        dataIndex: "language",
        sorter: true,
        render: (value: any, record: Book) => {
          return editableRowId === record.id ? (
            <Input
              defaultValue={value}
              disabled={updatePending}
              onChange={(e) =>
                setForm((f) => ({ ...(f as Book), language: e.target.value }))
              }
            />
          ) : (
            value
          );
        },
      },
      {
        title: "Country",
        dataIndex: "country",
        sorter: true,
        render: (value: any, record: Book) => {
          return editableRowId === record.id ? (
            <Input
              defaultValue={value}
              disabled={updatePending}
              onChange={(e) =>
                setForm((f) => ({ ...(f as Book), country: e.target.value }))
              }
            />
          ) : (
            value
          );
        },
      },
      {
        title: "Pages",
        dataIndex: "pages",
        sorter: true,
        render: (value: any, record: Book) => {
          return editableRowId === record.id ? (
            <InputNumber
              defaultValue={value}
              disabled={updatePending}
              onChange={(value) => {
                setForm((f) => ({ ...(f as Book), pages: value }));
              }}
            />
          ) : (
            value
          );
        },
      },
      {
        title: "Link",
        dataIndex: "link",
        sorter: true,
        render: (_: any, record: Book): ReactNode => {
          return (
            <a href={`https://${record.link}`} target="_blank" rel="noreferrer">
              {record.link}
            </a>
          );
        },
      },
      {
        title: "Actions",
        render: (_: any, record: Book): ReactNode => {
          const editable = editableRowId === record.id;
          return (
            <span className={styles.actionColumn}>
              {editable ? (
                <>
                  <Button
                    className={styles.actionButton}
                    shape="circle"
                    onClick={handleSave}
                    icon={<CheckOutlined />}
                    disabled={updatePending}
                  />
                  <Button
                    className={styles.actionButton}
                    shape="circle"
                    onClick={handleCancel}
                    icon={<CloseOutlined />}
                    disabled={updatePending}
                  />
                </>
              ) : (
                <Button
                  className={styles.actionButton}
                  shape="circle"
                  icon={<EditOutlined />}
                  onClick={() => handleEdit(record)}
                  disabled={updatePending || (editableRowId !== 0 && !editable)}
                />
              )}
            </span>
          );
        },
      },
    ],
    [editableRowId, handleCancel, handleEdit, handleSave, updatePending]
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
      {error}
      <Table
        bordered
        className={styles.table}
        columns={columns}
        rowKey={(record) => record.id}
        dataSource={books}
        pagination={{
          ...tableParams.pagination,
          total: total,
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
