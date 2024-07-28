import { apiSlice } from '@/features/api/apiSlice';

export const dashboardApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardCalc: builder.query({
      query: () => `/api/secret-root/admin/super-admin/dashboard/calc`,
      providesTags: ['super-admin/dashboard'],
      keepUnusedDataFor: 5,
    }),
  }),
});

export const { useGetDashboardCalcQuery } = dashboardApi;
