import { apiSlice } from '@/features/api/apiSlice';

export const dashboardApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getRetailerDashboardCalc: builder.query({
      query: () => `/api/web/retailer/dashboard/calc`,
      keepUnusedDataFor: 5,
    }),
    avgCollectedStamp: builder.query({
      query: () => `/api/web/retailer/dashboard/avg-collected-stamp`,
      keepUnusedDataFor: 5,
    }),
  }),
});

export const { useGetRetailerDashboardCalcQuery } = dashboardApi;
