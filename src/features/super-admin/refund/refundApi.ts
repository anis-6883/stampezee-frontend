import { apiSlice } from '@/features/api/apiSlice';

export const refundApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    allRefundBySuperAdmin: builder.query({
      query: (queries) => {
        const values = Object.values(queries);
        if (values.length) return `/api/secret-root/admin/super-admin/refund/all?${new URLSearchParams(queries as any)}`;
        return `/api/secret-root/admin/super-admin/refund/all`; // Ensure it returns a base URL if no queries are present
      },
      providesTags: ['superAdminRefund'],
    }),
    confirmRefundBySuperAdmin: builder.mutation({
      query: (id) => ({
        url: `/api/secret-root/admin/super-admin/refund/confirm/${id}`,
        method: 'PUT',
      }),
      invalidatesTags: ['superAdminRefund'],
    }),
    singleRefundBySuperAdmin: builder.query({
      query: (id) => `/api/secret-root/admin/super-admin/refund/find/${id}`,
    }),
  }),
});

export const { useAllRefundBySuperAdminQuery, useConfirmRefundBySuperAdminMutation, useSingleRefundBySuperAdminQuery } = refundApi;
