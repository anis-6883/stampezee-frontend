import { apiSlice } from '@/features/api/apiSlice';

export const dashboardApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getRetailerDashboardCalc: builder.query({
      query: (queries?: { dateRange?: string }) => {
        const dateRange = queries?.dateRange;

        if (dateRange) {
          if (dateRange.includes('to')) {
            const dates = dateRange.replaceAll(' ', '').split('to');
            const [start, end] = dates;
            return `/api/web/retailer/dashboard/calc?start=${start}&end=${end}`;
          }
          return `/api/web/retailer/dashboard/calc?start=${dateRange}&end=${dateRange}`;
        }

        // fallback if dateRange is not passed
        return `/api/web/retailer/dashboard/calc`;
      },
      keepUnusedDataFor: 5,
      providesTags: ['retailerProfile'],
    }),
    rewardCollectPercentage: builder.query({
      query: (queries?: { dateRange?: string }) => {
        const dateRange = queries?.dateRange;

        if (dateRange) {
          if (dateRange.includes('to')) {
            const dates = dateRange.replaceAll(' ', '').split('to');
            const [start, end] = dates;
            return `/api/web/retailer/dashboard/reward-collect-percentage?start=${start}&end=${end}`;
          }
          return `/api/web/retailer/dashboard/reward-collect-percentage?start=${dateRange}&end=${dateRange}`;
        }

        // fallback if dateRange is not passed
        return `/api/web/retailer/dashboard/reward-collect-percentage`;
      },
      keepUnusedDataFor: 5,
    }),
    avgCollectedStamp: builder.query({
      query: (queries) => {
        const { dateRange }: { dateRange: string } = queries;

        if (dateRange) {
          if (dateRange.includes('to')) {
            const dates = dateRange.replaceAll(' ', '').split('to');
            const [start, end] = dates;
            return `/api/web/retailer/dashboard/avg-collected-stamp?start=${start}&end=${end}`;
          }
          return `/api/web/retailer/dashboard/avg-collected-stamp?start=${dateRange}&end=${dateRange}`;
        }

        return `/api/web/retailer/dashboard/avg-collected-stamp`;
      },
      keepUnusedDataFor: 5,
    }),
  }),
});

export const { useGetRetailerDashboardCalcQuery, useAvgCollectedStampQuery, useRewardCollectPercentageQuery } = dashboardApi;
