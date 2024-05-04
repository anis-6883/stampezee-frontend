import axios from 'axios';

const bibleBackendUrl = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  timeout: 20000,
  withCredentials: true,
  headers: {
    'content-type': 'application/json',
    Accept: 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    'x-api-key': process.env.NEXT_PUBLIC_API_KEY,
  },
});

export { bibleBackendUrl };
