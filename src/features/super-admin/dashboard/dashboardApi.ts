import { apiSlice } from '@/features/api/apiSlice';

export const dashboardApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardCalc: builder.query({
      query: () => `/api/secret-root/admin/super-admin/dashboard/calc`,
      providesTags: ['super-adminDashboard'],
      keepUnusedDataFor: 5,
    }),
    getRetailerStatsWithCountryWise: builder.query({
      query: () => `/api/secret-root/admin/super-admin/dashboard/country-wise-retailer-stats`,
      providesTags: ['super-adminDashboard'],
      keepUnusedDataFor: 5,
    }),
  }),
});

export const { useGetDashboardCalcQuery, useGetRetailerStatsWithCountryWiseQuery } = dashboardApi;
