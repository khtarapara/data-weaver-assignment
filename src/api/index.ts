import { axiosInstance } from "./axiosInstance";
import { routes } from "./routes";
import type { Book, BooksAPI } from "../models/book";

export type getBooksParams = {
  page: number;
  pageSize: number;
  title: string;
  sortBy: string;
  DIR: "DESC" | "ASC";
};

export const getBooks = (params: getBooksParams) => {
  return axiosInstance.get<BooksAPI>(routes.books, {
    params,
  });
};

export const updateBook = (book: Book) => {
  const { id, ...record } = book;
  return axiosInstance.put(routes.updateBook(id), record);
};

export const addBook = (book: Book) => {
  const { id: _, ...record } = book;
  return axiosInstance.post(routes.books, record);
};
