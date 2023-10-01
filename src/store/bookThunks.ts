import { createAsyncThunk } from "@reduxjs/toolkit";
import { getBooks, type getBooksParams } from "../api";

export const fetchBooks = createAsyncThunk(
  "fetch/books",
  async (params: getBooksParams, _) => {
    const res = await getBooks(params);
    const { data, pagination } = res.data;

    return { data, total: pagination.totalElements, error: "" };
  }
);
