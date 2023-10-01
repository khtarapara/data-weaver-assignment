import { TablePaginationConfig } from "antd";

export type onSearchInfo = {
  source?: "clear" | "input";
};

export type onSearchEvent =
  | React.ChangeEvent<HTMLInputElement>
  | React.MouseEvent<HTMLElement>
  | React.KeyboardEvent<HTMLInputElement>;

export interface TableParams {
  pagination?: TablePaginationConfig;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
}
