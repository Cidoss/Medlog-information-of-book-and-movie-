import axios from 'axios';

export const openLibraryClient = axios.create({
  baseURL: 'https://openlibrary.org',
});