import { createAsyncThunk } from "@reduxjs/toolkit";
import { getBooks, type getBooksProps } from "../api";

export const fetchBooks = createAsyncThunk(
  "fetch/books",
  async ({ page, pageSize, title }: getBooksProps, thunkApi) => {
    try {
      const res = await getBooks({ page, pageSize, title });
      const { data, pagination } = res.data;

      return { data, total: pagination.totalElements };
    } catch (err) {
      console.error("error", err);
      thunkApi.rejectWithValue("Failed to fetch books.");
    }
  }
);
