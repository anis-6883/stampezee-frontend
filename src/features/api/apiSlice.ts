import { BaseQueryFn, createApi, FetchArgs, fetchBaseQuery, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { signOut } from 'next-auth/react';
import { RootState } from '../store';

export interface SerializedError {
  data: {
    status: boolean;
    message: string;
  };
}

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_BACKEND_URL as string,
  prepareHeaders: async (headers, { getState }) => {
    const token = (getState() as RootState).authSlice?.accessToken;
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    headers.set('x-api-key', process.env.NEXT_PUBLIC_API_KEY as string);
    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  const loginEndpoints = ['retailerLogin', 'superAdminLogin'];
  if (!loginEndpoints?.includes(api?.endpoint) && result.error && (result.error.status === 401 || result.error.status === 403)) {
    await signOut({
      redirect: true,
      callbackUrl: '/retailer/login',
    });
    // try to get a new token
    // const refreshResult = await baseQuery('/api/web/refresh-token', api, extraOptions);
    // if (refreshResult.data) {
    //   result = await baseQuery(args, api, extraOptions);
    // }
  }

  return result;
};

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
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
    'currency',
    'payment',
    'payments',
    'billing',
    'billings',
    'billingPortal',
    'superAdminRefund',
    'notification',
    'superAdminNotifications',
    'super-adminDashboard',
    'superAdminScanDetails',
    'retailerScanDetails',
    'superAdminCustomer',
    'criticalPayments',
    'generalSettings',
    'admin-dashboard-calc',
    'admin-dashboard-revenue-stats',
    'admin-dashboard-country-wise-retailer-stats',
    'admin-dashboard-country-wise-customer-stats',
    'admin-dashboard-top-outlets',
    'payment-card',
  ],
});
