import { apiSlice } from '@/features/api/apiSlice';

export const criticalPaymentApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllCriticalPayment: builder.query({
      query: (queries) => {
        const values = Object.values(queries);
        if (values.length) return `/api/secret-root/admin/super-admin/critical-payment/all?${new URLSearchParams(queries as any)}`;
        return `/api/secret-root/admin/super-admin/critical-payment/all`;
      },
      providesTags: ['criticalPayments'],
      keepUnusedDataFor: 5,
    }),

    resolveCriticalPayment: builder.mutation({
      query: (data) => ({
        url: `/api/secret-root/admin/super-admin/critical-payment/resolve`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['criticalPayments'],
    }),
  }),
});

export const { useGetAllCriticalPaymentQuery, useResolveCriticalPaymentMutation } = criticalPaymentApi;
