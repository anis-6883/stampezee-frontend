import { apiSlice } from '@/features/api/apiSlice';
import { IPagination, IResponse } from '@/types';

export const notificationApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    superAdminNotifications: builder.query<IResponse, IPagination>({
      query: (queries) => {
        const values = Object.values(queries);
        if (values.length) return `/api/secret-root/admin/super-admin/notification/all?${new URLSearchParams(queries as any)}`;
        return `/api/secret-root/admin/super-admin/notification/all`; // Ensure it returns a base URL if no queries are present
      },
      providesTags: ['superAdminNotifications'],
      keepUnusedDataFor: 0,
    }),
    createNotificationBySuperAdmin: builder.mutation({
      query: (data) => ({
        url: '/api/secret-root/admin/super-admin/notification/send',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['superAdminNotifications'],
    }),
    deleteNotificationBySuperAdmin: builder.mutation({
      query: (id) => ({
        url: `/api/secret-root/admin/super-admin/notification/delete/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['superAdminNotifications'],
    }),
  }),
});

export const { useSuperAdminNotificationsQuery, useCreateNotificationBySuperAdminMutation, useDeleteNotificationBySuperAdminMutation } =
  notificationApi;

export default notificationApi;
