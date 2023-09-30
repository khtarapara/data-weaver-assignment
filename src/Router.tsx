import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import BooksList from "./pages/books_list/BooksList";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<BooksList />} />
      </Routes>
    </BrowserRouter>
  );
}
