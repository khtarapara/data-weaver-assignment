import { axiosInstance } from "./axiosInstance";
import { routes } from "./routes";
import type { BooksAPI } from "../models/book";

export type getBooksProps = {
  page: number;
  pageSize: number;
  title: string;
};

export const getBooks = ({ page, pageSize, title }: getBooksProps) => {
  return axiosInstance.get<BooksAPI>(routes.books, {
    params: {
      page,
      pageSize,
      title,
    },
  });
};
