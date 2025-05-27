import { apiSlice } from '@/features/api/apiSlice';

export const dashboardApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getRetailerDashboardCalc: builder.query({
      query: (queries?: { dateRange?: string; value?: string[] }) => {
        const dateRange = queries?.dateRange;
        const branchIds = queries?.value;

        let url = `/api/web/retailer/dashboard/calc`;

        const params: string[] = [];

        // Handle date range
        if (dateRange) {
          if (dateRange.includes('to')) {
            const dates = dateRange.replaceAll(' ', '').split('to');
            const [start, end] = dates;
            params.push(`start=${start}`, `end=${end}`);
          } else {
            params.push(`start=${dateRange}`, `end=${dateRange}`);
          }
        }

        // Handle branch IDs
        if (branchIds && branchIds.length > 0) {
          params.push(`branchIds=${branchIds.join(',')}`);
        }

        if (params.length > 0) {
          url += `?${params.join('&')}`;
        }

        return url;
      },
      keepUnusedDataFor: 0,
      providesTags: ['retailerProfile'],
    }),

    rewardCollectPercentage: builder.query({
      query: (queries?: { dateRange?: string; value?: string[] }) => {
        const dateRange = queries?.dateRange;
        const branchIds = queries?.value;

        let url = `/api/web/retailer/dashboard/reward-collect-percentage`;
        const params: string[] = [];

        if (dateRange) {
          if (dateRange.includes('to')) {
            const dates = dateRange.replaceAll(' ', '').split('to');
            const [start, end] = dates;
            params.push(`start=${start}`, `end=${end}`);
          } else {
            params.push(`start=${dateRange}`, `end=${dateRange}`);
          }
        }

        if (branchIds && branchIds.length > 0) {
          params.push(`branchIds=${branchIds.join(',')}`);
        }

        if (params.length > 0) {
          url += `?${params.join('&')}`;
        }

        return url;
      },
      keepUnusedDataFor: 0,
    }),

    avgCollectedStamp: builder.query({
      query: (queries?: { dateRange?: string; value?: string[] }) => {
        const dateRange = queries?.dateRange;
        const branchIds = queries?.value;

        let url = `/api/web/retailer/dashboard/avg-collected-stamp`;
        const params: string[] = [];

        if (dateRange) {
          if (dateRange.includes('to')) {
            const dates = dateRange.replaceAll(' ', '').split('to');
            const [start, end] = dates;
            params.push(`start=${start}`, `end=${end}`);
          } else {
            params.push(`start=${dateRange}`, `end=${dateRange}`);
          }
        }

        if (branchIds && branchIds.length > 0) {
          params.push(`branchIds=${branchIds.join(',')}`);
        }

        if (params.length > 0) {
          url += `?${params.join('&')}`;
        }

        return url;
      },
      keepUnusedDataFor: 0,
    }),
  }),
});

export const { useGetRetailerDashboardCalcQuery, useAvgCollectedStampQuery, useRewardCollectPercentageQuery } = dashboardApi;
