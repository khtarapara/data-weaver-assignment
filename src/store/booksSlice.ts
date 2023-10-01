import { SliceCaseReducers, createSlice } from "@reduxjs/toolkit";
import { fetchBooks } from "./bookThunks";
import type { BookStore } from "../models/book";
import { toast } from "react-toastify";

export const booksSlice = createSlice<BookStore, SliceCaseReducers<BookStore>>({
  name: "books",
  initialState: { books: [], total: 0, loading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchBooks.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(fetchBooks.fulfilled, (state, action) => {
      if (!action.payload) {
        return;
      }
      const { data, total } = action.payload;
      state.books = data;
      state.total = total;
      state.loading = false;
    });

    builder.addCase(fetchBooks.rejected, (state) => {
      state.books = [];
      state.total = 0;
      state.loading = false;
      toast.error("Failed to fetch books.");
    });
  },
});

export const bookActions = booksSlice.actions;
