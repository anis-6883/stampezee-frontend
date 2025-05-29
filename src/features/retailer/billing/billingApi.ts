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
    getSinglePaymentMethodById: builder.query({
      query: (paymentMethodId) => `/api/web/retailer/billing/find-payment-method/${paymentMethodId}`,
      providesTags: ['change-payment-card'],
    }),
    singleBilling: builder.query({
      query: (_id) => `/api/web/retailer/billing/find/${_id}`,
      providesTags: ['billings', 'change-payment-card'],
      keepUnusedDataFor: 10,
    }),
    getAllPaymentByEnrollId: builder.query({
      query: ({ queries, enrolmentId }: any) => {
        const values = Object.values(queries);
        if (values.length) return `/api/web/retailer/billing/find/payments/${enrolmentId}?${new URLSearchParams(queries as any)}`;
        return `/api/web/retailer/billing/find/payments/${enrolmentId}`; // Ensure it returns a base URL if no queries are present
      },
    }),
    createBillingPdf: builder.mutation({
      query: (id) => ({
        url: `/api/web/retailer/billing/download-pdf/${id}`,
        method: 'POST',
        // body: data,
        responseHandler: (response) => response.blob(),
      }),
    }),
    createBillingPdfForTrial: builder.mutation({
      query: ({ id, data }) => ({
        url: `/api/web/retailer/billing/download-pdf-trial/${id}`,
        method: 'POST',
        body: data,
        responseHandler: (response) => response.blob(),
      }),
    }),
    getBillingPortal: builder.mutation({
      query: (data) => ({
        url: `/api/web/retailer/billing/portal`,
        method: 'POST',
        body: data,
      }),
    }),
    getAllPaymentMethod: builder.query({
      query: ({ customerId, limit }) => ({
        url: `/api/web/retailer/billing/payment-method/all/${customerId}?limit=${limit}`,
        method: 'GET',
      }),
      providesTags: ['payment-card'],
    }),
    getAllExistingBilling: builder.query({
      query: () => ({
        url: `/api/web/retailer/billing/all-existing-addons`,
        method: 'GET',
      }),
    }),
    attachPaymentMethod: builder.mutation({
      query: (data) => ({
        url: `/api/web/retailer/billing/attach-payment-method`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['payment-card'],
    }),
    detachPaymentMethod: builder.mutation({
      query: (data) => ({
        url: `/api/web/retailer/billing/detach-payment-method`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['payment-card'],
    }),
    setDefaultPaymentMethod: builder.mutation({
      query: (data) => ({
        url: `/api/web/retailer/billing/default-payment-method`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['payment-card'],
    }),
    cancelSubscription: builder.mutation({
      query: (data) => ({
        url: `/api/web/retailer/billing/cancel-subscription`,
        method: 'DELETE',
        body: data,
      }),
      invalidatesTags: ['billings', 'branches', 'retailerStamp', 'subAdmin', 'retailerProfile', 'refund'],
    }),
    setupPaymentIntent: builder.mutation({
      query: () => ({
        url: `/api/web/retailer/billing/setup-payment-intent`,
        method: 'POST',
        // body: data,
      }),
    }),
    changePaymentMethod: builder.mutation({
      query: (data) => ({
        url: `/api/web/retailer/billing/change-payment-method`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['change-payment-card'],
    }),
  }),
});

export const {
  useAllBillingQuery,
  useSingleBillingQuery,
  useGetBillingPortalMutation,
  useCreateBillingPdfMutation,
  useCreateBillingPdfForTrialMutation,
  useAttachPaymentMethodMutation,
  useSetupPaymentIntentMutation,
  useGetAllPaymentMethodQuery,
  useCancelSubscriptionMutation,
  useDetachPaymentMethodMutation,
  useSetDefaultPaymentMethodMutation,
  useGetAllExistingBillingQuery,
  useGetSinglePaymentMethodByIdQuery,
  useChangePaymentMethodMutation,
  useGetAllPaymentByEnrollIdQuery,
} = billingApi;
