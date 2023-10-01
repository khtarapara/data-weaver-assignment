import { SliceCaseReducers, createSlice } from "@reduxjs/toolkit";
import { fetchBooks } from "./bookThunks";
import type { BookStore } from "../models/book";

export const booksSlice = createSlice<BookStore, SliceCaseReducers<BookStore>>({
  name: "books",
  initialState: { books: [], total: 0, loading: false, error: "" },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchBooks.pending, (state) => {
      state.loading = true;
      state.error = "";
    });

    builder.addCase(fetchBooks.fulfilled, (state, action) => {
      if (!action.payload) {
        return;
      }
      const { data, total, error } = action.payload;
      state.books = data;
      state.total = total;
      state.loading = false;
      state.error = error;
    });

    builder.addCase(fetchBooks.rejected, (state, action) => {
      state.books = [];
      state.total = 0;
      state.loading = false;
      state.error = "Failed to fetch books.";
    });
  },
});

export const bookActions = booksSlice.actions;
