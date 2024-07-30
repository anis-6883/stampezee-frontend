import { apiSlice } from '@/features/api/apiSlice';

export const scanApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    retailerAllScanDetails: builder.query({
      query: (queries) => {
        const values = Object.values(queries);
        if (values.length) return `/api/web/retailer/scans/details?${new URLSearchParams(queries as any)}`;
        return `/api/web/retailer/scans/details`; // Ensure it returns a base URL if no queries are present
      },
      providesTags: ['retailerScanDetails'],
    }),
  }),
});

export const { useRetailerAllScanDetailsQuery } = scanApi;
