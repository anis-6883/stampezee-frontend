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
      keepUnusedDataFor: 0,
    }),
    singleSubscriptionPayment: builder.query({
      query: (_id) => `/api/secret-root/admin/super-admin/payment/subscription/find/${_id}`,
      providesTags: ['payments'],
      keepUnusedDataFor: 10,
    }),
    getSinglePaymentMethodBySuperAdmin: builder.query({
      query: (paymentMethodId) => `/api/secret-root/admin/super-admin/payment/find-payment-method/${paymentMethodId}`,
    }),
    getAllPaymentMethodBySuperAdmin: builder.query({
      query: ({ queries, enrolmentId }: any) => {
        const values = Object.values(queries);
        if (values.length)
          return `/api/secret-root/admin/super-admin/payment/subscription/find/payments/${enrolmentId}?${new URLSearchParams(queries as any)}`;
        return `/api/secret-root/admin/super-admin/payment/subscription/find/payments/${enrolmentId}`; // Ensure it returns a base URL if no queries are present
      },
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
        url: `/api/secret-root/admin/super-admin/payment/cancel-subscription`,
        method: 'DELETE',
        body: data,
      }),
      invalidatesTags: ['payments', 'superAdminRefund'],
    }),

    getAllPaymentMethodByAdmin: builder.query({
      query: ({ customerId, limit }) => ({
        url: `/api/secret-root/admin/super-admin/payment/payment-method/all/${customerId}?limit=${limit}`,
        method: 'GET',
      }),
      providesTags: ['payment-card'],
    }),
    attachPaymentMethodByAdmin: builder.mutation({
      query: (data) => ({
        url: `/api/secret-root/admin/super-admin/payment/attach-payment-method`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['payment-card'],
    }),
    detachPaymentMethodByAdmin: builder.mutation({
      query: (data) => ({
        url: `/api/secret-root/admin/super-admin/payment/detach-payment-method`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['payment-card'],
    }),
    setDefaultPaymentMethodByAdmin: builder.mutation({
      query: (data) => ({
        url: `/api/secret-root/admin/super-admin/payment/default-payment-method`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['payment-card'],
    }),
    setupPaymentIntentByAdmin: builder.mutation({
      query: () => ({
        url: `/api/secret-root/admin/super-admin/payment/setup-payment-intent`,
        method: 'POST',
        // body: data,
      }),
    }),
  }),
});

export const {
  useGetSubscriptionPaymentsQuery,
  useSingleSubscriptionPaymentQuery,
  useCreateBillingPdfBySuperAdminMutation,
  useCancelSubscriptionByAdminMutation,
  useAttachPaymentMethodByAdminMutation,
  useDetachPaymentMethodByAdminMutation,
  useGetAllPaymentMethodByAdminQuery,
  useSetDefaultPaymentMethodByAdminMutation,
  useSetupPaymentIntentByAdminMutation,
  useGetSinglePaymentMethodBySuperAdminQuery,
  useGetAllPaymentMethodBySuperAdminQuery,
} = paymentApi;
