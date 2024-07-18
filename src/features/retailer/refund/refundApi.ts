import { apiSlice } from '@/features/api/apiSlice';

export const refundApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    allRefund: builder.query({
      query: (queries) => {
        const values = Object.values(queries);
        if (values.length) return `/api/web/retailer/refund/all?${new URLSearchParams(queries as any)}`;
        return `/api/web/retailer/refund/all`; // Ensure it returns a base URL if no queries are present
      },
      //   providesTags: ['refund'],
    }),
  }),
});

export const { useAllRefundQuery } = refundApi;
