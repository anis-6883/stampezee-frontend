import { apiSlice } from '@/features/api/apiSlice';
import { IPagination, IResponse } from '@/types';

export const superAdminStampImageApi = apiSlice.injectEndpoints({
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
      query: () => '/api/subscription-plans',
    }),

    updateSubscription: builder.mutation({
      query: ({ id, data }: any) => ({
        url: `api/secret-root/admin/super-admin/subscription/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['superAdminSubscription'],
    }),
  }),
});

export const { useGetSubscriptionQuery, useGetAllSubscriptionQuery, useUpdateSubscriptionMutation } = superAdminStampImageApi;

export default superAdminStampImageApi;
