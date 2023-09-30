export interface Book {
  author: string;
  country: string;
  language: string;
  link?: string;
  pages?: string;
  title: string;
  year: string;
  id: number;
}

export interface BooksAPI {
  pagination: {
    sortDirection: string;
    totalPages: number;
    pageSize: number;
    currentPage: number;
    totalElements: number;
  };
  data: Book[];
}
