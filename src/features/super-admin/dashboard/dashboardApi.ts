import { apiSlice } from '@/features/api/apiSlice';

export const dashboardApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardCalc: builder.query({
      query: () => `/api/secret-root/admin/super-admin/dashboard/calc`,
      providesTags: ['admin-dashboard-calc'],
      keepUnusedDataFor: 5,
    }),
    getDashboardRevenue: builder.query({
      query: () => `/api/secret-root/admin/super-admin/dashboard/revenue-stats`,
      providesTags: ['admin-dashboard-revenue-stats'],
      keepUnusedDataFor: 5,
    }),
    getRetailerStatsWithCountryWise: builder.query({
      query: () => `/api/secret-root/admin/super-admin/dashboard/country-wise-retailer-stats`,
      providesTags: ['admin-dashboard-country-wise-retailer-stats'],
      keepUnusedDataFor: 5,
    }),
    getCustomerStatsWithCountryWise: builder.query({
      query: () => `/api/secret-root/admin/super-admin/dashboard/country-wise-customer-stats`,
      providesTags: ['admin-dashboard-country-wise-customer-stats'],
      keepUnusedDataFor: 5,
    }),
  }),
});

export const {
  useGetDashboardCalcQuery,
  useGetRetailerStatsWithCountryWiseQuery,
  useGetCustomerStatsWithCountryWiseQuery,
  useGetDashboardRevenueQuery,
} = dashboardApi;
