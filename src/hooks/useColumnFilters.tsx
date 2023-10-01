import React from "react";
import { Button, Input, InputRef, Space } from "antd";
import { ColumnType, FilterDropdownProps } from "antd/es/table/interface";
import { FilterConfirmProps } from "antd/es/table/interface";
import { useCallback, useRef, useState } from "react";
import { SearchOutlined } from "@ant-design/icons";

export default function useColumnFilters<RecordType>() {
  type DataIndex = keyof RecordType;
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState<DataIndex | "">("");
  const searchInput = useRef<InputRef>(null);

  const handleColumnSearch = useCallback(
    (
      selectedKeys: string[],
      confirm: (param?: FilterConfirmProps) => void,
      dataIndex: DataIndex
    ) => {
      confirm();
      setSearchText(selectedKeys[0]);
      setSearchedColumn(dataIndex);
    },
    []
  );

  const getColumnSearchProps = useCallback(
    (dataIndex: DataIndex): ColumnType<RecordType> => ({
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
        close,
      }: FilterDropdownProps) => (
        <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
          <Input
            ref={searchInput}
            placeholder={`Search ${String(dataIndex)}`}
            value={selectedKeys[0]}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            onPressEnter={() => {}}
            style={{ marginBottom: 8, display: "block" }}
          />

          <Space>
            <Button
              type="primary"
              onClick={() =>
                handleColumnSearch(selectedKeys as string[], confirm, dataIndex)
              }
              icon={<SearchOutlined />}
              size="small"
              style={{ width: 90 }}
            >
              Search
            </Button>

            <Button
              onClick={() => {
                clearFilters && clearFilters();
                setSearchText("");
              }}
              size="small"
              style={{ width: 90 }}
            >
              Reset
            </Button>

            <Button
              type="link"
              size="small"
              onClick={() => {
                close();
              }}
            >
              close
            </Button>
          </Space>
        </div>
      ),
      filterIcon: (filtered: boolean) => (
        <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
      ),
      onFilter: (value, record) => {
        const cellValue = record[dataIndex];
        if (!cellValue) {
          return false;
        }
        return cellValue
          .toString()
          .toLowerCase()
          .includes((value as string).toLowerCase());
      },
      onFilterDropdownOpenChange: (visible) => {
        if (visible) {
          setTimeout(() => searchInput.current?.select(), 100);
        }
      },
    }),
    [handleColumnSearch]
  );

  return { searchText, searchedColumn, getColumnSearchProps };
}
