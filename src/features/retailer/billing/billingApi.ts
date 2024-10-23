import { apiSlice } from '@/features/api/apiSlice';

export const billingApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    allBilling: builder.query({
      query: (queries) => {
        const values = Object.values(queries);
        if (values.length) return `/api/web/retailer/billing/all?${new URLSearchParams(queries as any)}`;
        return `/api/web/retailer/billing/all`; // Ensure it returns a base URL if no queries are present
      },
      providesTags: ['billings'],
      keepUnusedDataFor: 10,
    }),
    singleBilling: builder.query({
      query: (_id) => `/api/web/retailer/billing/find/${_id}`,
      providesTags: (result, error, arg) => [{ type: 'billing', id: arg }],
      keepUnusedDataFor: 10,
    }),
    getBillingPortal: builder.mutation({
      query: (data) => ({
        url: `/api/web/retailer/billing/portal`,
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const { useAllBillingQuery, useSingleBillingQuery, useGetBillingPortalMutation } = billingApi;
