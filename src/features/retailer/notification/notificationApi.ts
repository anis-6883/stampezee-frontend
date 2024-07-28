import { apiSlice } from '@/features/api/apiSlice';
import { IPagination, IResponse } from '@/types';

export const notificationApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllNotification: builder.query<IResponse, IPagination>({
      query: (queries) => {
        const values = Object.values(queries);
        if (values.length) return `/api/web/retailer/notification/all?${new URLSearchParams(queries as any)}`;
        return `/api/web/retailer/notification/all`; // Ensure it returns a base URL if no queries are present
      },
      providesTags: ['notification'],
    }),
    createNotification: builder.mutation({
      query: (data) => ({
        url: '/api/web/retailer/notification/all',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['notification'],
    }),
    createNotificationByLocation: builder.mutation({
      query: (data) => ({
        url: '/api/web/retailer/notification/location',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['notification'],
    }),
    updateSuperAdminStampImage: builder.mutation({
      query: ({ id, data }: any) => ({
        url: `api/secret-root/admin/super-admin/stamp-image/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['superAdminRetailerStamp'],
    }),
    updateSortingImage: builder.mutation({
      query: (data) => ({
        url: `api/secret-root/admin/super-admin/sort`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['superAdminRetailerStamp'],
    }),
    updateStampImageStatus: builder.mutation({
      query: ({ data, branchId }) => ({
        url: `api/secret-root/admin/super-admin/stamp-image/status/${branchId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['superAdminRetailerStamp'],
    }),
    deleteSuperAdminStampImage: builder.mutation({
      query: (id) => ({
        url: `api/secret-root/admin/super-admin/stamp-image/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['superAdminRetailerStamp'],
    }),
  }),
});

export const {
  useGetAllNotificationQuery,
  useCreateNotificationMutation,
  useCreateNotificationByLocationMutation,
  useUpdateSuperAdminStampImageMutation,
  useDeleteSuperAdminStampImageMutation,
  useUpdateStampImageStatusMutation,
  useUpdateSortingImageMutation,
} = notificationApi;

export default notificationApi;
