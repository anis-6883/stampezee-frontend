import { apiSlice } from '@/features/api/apiSlice';

export const dashboardApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardCalc: builder.query({
      query: (queries) => {
        const { dateRange }: { dateRange: string } = queries;
        if (dateRange) {
          if (dateRange.includes('to')) {
            const dates = dateRange.replaceAll(' ', '').split('to');
            const [start, end] = dates;
            return `/api/secret-root/admin/super-admin/dashboard/calc?start=${start}&end=${end}`;
          }
          return `/api/secret-root/admin/super-admin/dashboard/calc?start=${dateRange}&end=${dateRange}`;
        } else {
          return '/api/secret-root/admin/super-admin/dashboard/calc';
        }
      },
      providesTags: ['admin-dashboard-calc'],
      keepUnusedDataFor: 0,
    }),
    getTopOutlets: builder.query({
      query: (queries) => {
        const { dateRange }: { dateRange: string } = queries;
        if (dateRange) {
          if (dateRange.includes('to')) {
            const dates = dateRange.replaceAll(' ', '').split('to');
            const [start, end] = dates;
            return `/api/secret-root/admin/super-admin/dashboard/top-outlets?start=${start}&end=${end}`;
          }
          return `/api/secret-root/admin/super-admin/dashboard/top-outlets?start=${dateRange}&end=${dateRange}`;
        } else {
          return '/api/secret-root/admin/super-admin/dashboard/top-outlets';
        }
      },
      providesTags: ['admin-dashboard-top-outlets'],
      keepUnusedDataFor: 0,
    }),
    getDashboardRevenue: builder.query({
      query: (queries) => {
        const { dateRange }: { dateRange: string } = queries;
        if (dateRange) {
          if (dateRange.includes('to')) {
            const dates = dateRange.replaceAll(' ', '').split('to');
            const [start, end] = dates;
            return `/api/secret-root/admin/super-admin/dashboard/revenue-stats?start=${start}&end=${end}`;
          }
          return `/api/secret-root/admin/super-admin/dashboard/revenue-stats?start=${dateRange}&end=${dateRange}`;
        }

        return `/api/secret-root/admin/super-admin/dashboard/revenue-stats`;
      },
      providesTags: ['admin-dashboard-revenue-stats'],
      keepUnusedDataFor: 5,
    }),
    getRetailerStatsWithCountryWise: builder.query({
      query: (queries) => {
        const { dateRange }: { dateRange: string } = queries;
        if (dateRange) {
          if (dateRange.includes('to')) {
            const dates = dateRange.replaceAll(' ', '').split('to');
            const [start, end] = dates;
            return `/api/secret-root/admin/super-admin/dashboard/country-wise-retailer-stats?start=${start}&end=${end}`;
          }
          return `/api/secret-root/admin/super-admin/dashboard/country-wise-retailer-stats?start=${dateRange}&end=${dateRange}`;
        } else {
          return `/api/secret-root/admin/super-admin/dashboard/country-wise-retailer-stats`;
        }
      },
      providesTags: ['admin-dashboard-country-wise-retailer-stats'],
      keepUnusedDataFor: 0,
    }),
    getCustomerStatsWithCountryWise: builder.query({
      query: (queries) => {
        const { dateRange }: { dateRange: string } = queries;
        if (dateRange) {
          if (dateRange.includes('to')) {
            const dates = dateRange.replaceAll(' ', '').split('to');
            const [start, end] = dates;
            return `/api/secret-root/admin/super-admin/dashboard/country-wise-customer-stats?/start=${start}&end=${end}`;
          }
          return `/api/secret-root/admin/super-admin/dashboard/country-wise-customer-stats?/start=${dateRange}&end=${dateRange}`;
        } else {
          return `/api/secret-root/admin/super-admin/dashboard/country-wise-customer-stats`;
        }
      },
      providesTags: ['admin-dashboard-country-wise-customer-stats'],
      keepUnusedDataFor: 0,
    }),
  }),
});

export const {
  useGetTopOutletsQuery,
  useGetDashboardCalcQuery,
  useGetDashboardRevenueQuery,
  useGetRetailerStatsWithCountryWiseQuery,
  useGetCustomerStatsWithCountryWiseQuery,
} = dashboardApi;
