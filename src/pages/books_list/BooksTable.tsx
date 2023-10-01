import { Button, Input, InputNumber, Table as AntdTable } from "antd";
import { ColumnsType, TablePaginationConfig } from "antd/es/table";
import React, { ReactNode, useCallback, useMemo, useState } from "react";
import { Book } from "../../models/book";
import Highlighter from "react-highlight-words";
import useColumnFilters from "../../hooks/useColumnFilters";

import styles from "./BooksList.module.css";
import { updateBook } from "../../api";
import { CheckOutlined, CloseOutlined, EditOutlined } from "@ant-design/icons";
import { FilterValue, SorterResult } from "antd/es/table/interface";
import { TableParams } from "./types";
import { useAppSelector } from "../../store/hooks";

const Table = React.memo(AntdTable<Book>);

interface BooksTableProps {
  fetchBooks: () => void;
  tableParams: TableParams;
  onChange: (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<Book> | SorterResult<Book>[],
    extra: any
  ) => void;
}

export default function BooksTable({
  fetchBooks,
  tableParams,
  onChange,
}: BooksTableProps) {
  const { books, total, loading } = useAppSelector((state) => state.books);
  const [editableRowId, setEditableRowId] = useState<number>(0);
  const [updatePending, setUpdatePending] = useState<boolean>(false);
  const [form, setForm] = useState<Book | null>(null);
  const { searchText, searchedColumn, getColumnSearchProps } =
    useColumnFilters<Book>();

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

  const getHighlightedText = useCallback(
    (value: any, dataIndex: keyof Book) =>
      dataIndex === searchedColumn ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={value ? value.toString() : ""}
        />
      ) : (
        value
      ),
    [searchText, searchedColumn]
  );

  const columns = useMemo<ColumnsType<Book>>(
    () => [
      {
        title: "Title",
        dataIndex: "title",
        sorter: true,
        render: (value: any, record: Book) => {
          if (editableRowId === record.id) {
            return (
              <Input
                defaultValue={value}
                disabled={updatePending}
                onChange={(e) =>
                  setForm((f) => ({ ...(f as Book), title: e.target.value }))
                }
              />
            );
          }

          return getHighlightedText(value, "title");
        },
        ...getColumnSearchProps("title"),
      },
      {
        title: "Author",
        dataIndex: "author",
        sorter: true,
        render: (value: any, record: Book) => {
          if (editableRowId === record.id) {
            return (
              <Input
                defaultValue={value}
                disabled={updatePending}
                onChange={(e) =>
                  setForm((f) => ({ ...(f as Book), author: e.target.value }))
                }
              />
            );
          }

          return getHighlightedText(value, "author");
        },
        ...getColumnSearchProps("author"),
      },
      {
        title: "Year",
        dataIndex: "year",
        sorter: true,
        render: (value: any, record: Book) => {
          if (editableRowId === record.id) {
            return (
              <InputNumber
                defaultValue={value}
                disabled={updatePending}
                onChange={(value) =>
                  setForm((f) => ({ ...(f as Book), year: value }))
                }
              />
            );
          }

          return getHighlightedText(value, "year");
        },
        ...getColumnSearchProps("year"),
      },
      {
        title: "Language",
        dataIndex: "language",
        sorter: true,
        render: (value: any, record: Book) => {
          if (editableRowId === record.id) {
            return (
              <Input
                defaultValue={value}
                disabled={updatePending}
                onChange={(e) =>
                  setForm((f) => ({ ...(f as Book), language: e.target.value }))
                }
              />
            );
          }
          return getHighlightedText(value, "language");
        },
        ...getColumnSearchProps("language"),
      },
      {
        title: "Country",
        dataIndex: "country",
        sorter: true,
        render: (value: any, record: Book) => {
          if (editableRowId === record.id) {
            return (
              <Input
                defaultValue={value}
                disabled={updatePending}
                onChange={(e) =>
                  setForm((f) => ({ ...(f as Book), country: e.target.value }))
                }
              />
            );
          }
          return getHighlightedText(value, "country");
        },
        ...getColumnSearchProps("country"),
      },
      {
        title: "Pages",
        dataIndex: "pages",
        sorter: true,
        render: (value: any, record: Book) => {
          if (editableRowId === record.id) {
            return (
              <InputNumber
                defaultValue={value}
                disabled={updatePending}
                onChange={(value) => {
                  setForm((f) => ({ ...(f as Book), pages: value }));
                }}
              />
            );
          }
          return getHighlightedText(value, "pages");
        },
        ...getColumnSearchProps("pages"),
      },
      {
        title: "Link",
        dataIndex: "link",
        sorter: true,
        render: (value: any, record: Book) => {
          if (editableRowId === record.id) {
            <Input
              defaultValue={value}
              disabled={updatePending}
              onChange={(e) =>
                setForm((f) => ({ ...(f as Book), link: e.target.value }))
              }
            />;
          }

          return (
            <a href={`https://${record.link}`} target="_blank" rel="noreferrer">
              {getHighlightedText(value, "link")}
            </a>
          );
        },
        ...getColumnSearchProps("link"),
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
    [
      editableRowId,
      getColumnSearchProps,
      getHighlightedText,
      handleCancel,
      handleEdit,
      handleSave,
      updatePending,
    ]
  );
  return (
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
      onChange={onChange}
      loading={loading}
    />
  );
}
