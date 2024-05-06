import { BaseQueryFn, createApi, FetchArgs, fetchBaseQuery, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_BACKEND_URL as string,
  prepareHeaders: async (headers) => {
    headers.set('x-api-key', process.env.NEXT_PUBLIC_API_KEY as string);
    headers.set('credentials', 'include');
    return headers;
  },
  credentials: 'include',
});

const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  if (result.error && (result.error.status === 401 || result.error.status === 403)) {
    // try to get a new token
    const refreshResult = await baseQuery('/api/v1/admin/refresh-token', api, extraOptions);
    if (refreshResult.data) {
      result = await baseQuery(args, api, extraOptions);
    }
  }
  return result;
};

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  endpoints: () => ({}),
  tagTypes: ['userProfile', 'userOwnProfile', 'contentManagement', 'dailyManna', 'user'],
});
