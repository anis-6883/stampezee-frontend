import { apiSlice } from '@/features/api/apiSlice';
import { IPagination, IResponse } from '@/types';

export const superAdminStampImageApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllSuperAdminStampImages: builder.query<IResponse, IPagination>({
      query: (queries) => {
        const values = Object.values(queries);
        if (values.length) return `/api/secret-root/admin/super-admin/stamp-image/all?${new URLSearchParams(queries as any)}`;
        return `/api/secret-root/admin/super-admin/stamp-image/all`; // Ensure it returns a base URL if no queries are present
      },
      providesTags: ['superAdminRetailerStamp'],
    }),
    createSuperAdminStampImage: builder.mutation({
      query: (newStampImage) => ({
        url: '/api/secret-root/admin/super-admin/stamp-image',
        method: 'POST',
        body: newStampImage,
      }),
      invalidatesTags: ['superAdminRetailerStamp'],
    }),
    updateSuperAdminStampImage: builder.mutation({
      query: ({ id, data }: any) => ({
        url: `api/secret-root/admin/super-admin/stamp-image/${id}`,
        method: 'PUT',
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
  useGetAllSuperAdminStampImagesQuery,
  useCreateSuperAdminStampImageMutation,
  useUpdateSuperAdminStampImageMutation,
  useDeleteSuperAdminStampImageMutation,
  useUpdateStampImageStatusMutation,
} = superAdminStampImageApi;

export default superAdminStampImageApi;
