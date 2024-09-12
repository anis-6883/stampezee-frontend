import { apiSlice } from '@/features/api/apiSlice';

export const billingApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    allBilling: builder.query({
      query: (queries) => {
        const values = Object.values(queries);
        if (values.length) return `/api/web/retailer/billing/all?${new URLSearchParams(queries as any)}`;
        return `/api/web/retailer/billing/all`; // Ensure it returns a base URL if no queries are present
      },
      providesTags: ['billing'],
      keepUnusedDataFor: 10,
    }),
  }),
});

export const { useAllBillingQuery } = billingApi;
