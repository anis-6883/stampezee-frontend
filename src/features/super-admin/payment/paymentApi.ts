import { apiSlice } from '@/features/api/apiSlice';

export const paymentApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSubscriptionPayments: builder.query({
      query: (queries) => {
        const values = Object.values(queries);
        if (values.length) return `/api/secret-root/admin/super-admin/payment/subscription/all?${new URLSearchParams(queries as any)}`;
        return `/api/secret-root/admin/super-admin/payment/subscription`;
      },
      providesTags: ['payments'],
      keepUnusedDataFor: 5,
    }),
    singleSubscriptionPayment: builder.query({
      query: (_id) => `/api/secret-root/admin/super-admin/payment/subscription/find/${_id}`,
      providesTags: ['payments'],
      keepUnusedDataFor: 10,
    }),
    createBillingPdfBySuperAdmin: builder.mutation({
      query: (id) => ({
        url: `/api/secret-root/admin/super-admin/payment/download-pdf/${id}`,
        method: 'POST',
        // body: data,
        responseHandler: (response) => response.blob(),
      }),
    }),
    cancelSubscriptionByAdmin: builder.mutation({
      query: (data) => ({
        url: `/api/secret-root/admin/super-admin/payment/cancel-addon-subscription`,
        method: 'DELETE',
        body: data,
      }),
      invalidatesTags: ['payments'],
    }),
    getRetailerBillingPortal: builder.mutation({
      query: (data) => ({
        url: `/api/secret-root/admin/super-admin/payment/retailer-billing-portal`,
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const {
  useGetSubscriptionPaymentsQuery,
  useSingleSubscriptionPaymentQuery,
  useGetRetailerBillingPortalMutation,
  useCreateBillingPdfBySuperAdminMutation,
  useCancelSubscriptionByAdminMutation,
} = paymentApi;
