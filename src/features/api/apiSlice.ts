import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../store';

export interface SerializedError {
  data: {
    status: boolean;
    message: string;
  };
}

// const baseQuery = fetchBaseQuery({
//   baseUrl: process.env.NEXT_PUBLIC_BACKEND_URL as string,
//   prepareHeaders: async (headers) => {
//     headers.set('x-api-key', process.env.NEXT_PUBLIC_API_KEY as string);
//     headers.set('credentials', 'include');
//     return headers;
//   },
//   credentials: 'include',
// });

// const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (args, api, extraOptions) => {
//   let result = await baseQuery(args, api, extraOptions);
//   if (result.error && (result.error.status === 401 || result.error.status === 403)) {
//     // try to get a new token
//     const refreshResult = await baseQuery('/api/web/refresh-token', api, extraOptions);
//     if (refreshResult.data) {
//       result = await baseQuery(args, api, extraOptions);
//     }
//   }

//   return result;
// };

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_BACKEND_URL as string,
    prepareHeaders: async (headers, { getState }) => {
      const token = (getState() as RootState).authSlice?.accessToken;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }

      headers.set('x-api-key', process.env.NEXT_PUBLIC_API_KEY as string);

      return headers;
    },
  }),
  endpoints: () => ({}),
  tagTypes: [
    'userProfile',
    'userOwnProfile',
    'contentManagement',
    'user',
    'retailerProfile',
    'superAdminProfile',
    'branches',
    'branch',
    'subAdminBranches',
    'retailerStamp',
    'subAdmin',
    'superAdminRetailerStamp',
    'superAdminRetailerStampCategory',
    'superAdminRetailer',
    'superAdminSubscription',
    'faq',
    'coupon',
    'coupons',
    'payments',
    'billing',
    'superAdminRefund',
    'notification',
    'super-adminDashboard',
    'retailerScanDetails',
  ],
});
