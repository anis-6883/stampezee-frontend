import { apiSlice } from '@/features/api/apiSlice';
import { IPagination, IResponse } from '@/types';

export const subscriptionApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllSubscription: builder.query<IResponse, IPagination>({
      query: (queries) => {
        const values = Object.values(queries);
        if (values.length) return `/api/secret-root/admin/super-admin/subscription/all?${new URLSearchParams(queries as any)}`;
        return `/api/secret-root/admin/super-admin/subscription/all`; // Ensure it returns a base URL if no queries are present
      },
      providesTags: ['superAdminSubscription'],
    }),

    getSubscription: builder.query({
      query: () => '/api/web/subscription-plans',
    }),
    getSingleSubscription: builder.query({
      query: (id) => `/api/secret-root/admin/super-admin/subscription/${id}`,
    }),

    updateSubscription: builder.mutation({
      query: ({ id, data }: any) => ({
        url: `api/secret-root/admin/super-admin/subscription/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['superAdminSubscription'],
    }),
    createCheckOut: builder.mutation({
      query: (data: any) => ({
        url: `/api/web/subscription-plans/checkout`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['superAdminSubscription'],
    }),
    createCoupon: builder.mutation({
      query: (data: any) => ({
        url: `/api/web/subscription-plans/coupon-validity-check`,
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const {
  useCreateCheckOutMutation,
  useGetSubscriptionQuery,
  useGetAllSubscriptionQuery,
  useGetSingleSubscriptionQuery,
  useUpdateSubscriptionMutation,
  useCreateCouponMutation,
} = subscriptionApi;

export default subscriptionApi;
