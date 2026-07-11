import axios from 'axios';

const GOOGLE_BOOKS_BASE_URL = 'https://www.googleapis.com/books/v1';

export const googleBooksClient = axios.create({
  baseURL: GOOGLE_BOOKS_BASE_URL,
});