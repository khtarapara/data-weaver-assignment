import { createAsyncThunk } from "@reduxjs/toolkit";
import { getBooks, type getBooksParams } from "../api";

export const fetchBooks = createAsyncThunk(
  "fetch/books",
  async (params: getBooksParams, thunkApi) => {
    try {
      const res = await getBooks(params);
      const { data, pagination } = res.data;

      return { data, total: pagination.totalElements };
    } catch (err) {
      console.error("error", err);
      thunkApi.rejectWithValue("Failed to fetch books.");
    }
  }
);
