import { apiSlice } from '@/features/api/apiSlice';
import { IPagination, IResponse } from '@/types';

export const superAdminRetailerApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllRetailers: builder.query<IResponse, IPagination>({
      query: (queries) => {
        const values = Object.values(queries);
        if (values.length) return `api/secret-root/admin/super-admin/manage-retailer/all?${new URLSearchParams(queries as any)}`;
        return `api/secret-root/admin/super-admin/manage-retailer/all`; // Ensure it returns a base URL if no queries are present
      },
      providesTags: ['superAdminRetailer'],
    }),
    createSuperAdminRetailer: builder.mutation({
      query: (newRetailer) => ({
        url: '/api/secret-root/admin/super-admin/manage-retailer',
        method: 'POST',
        body: newRetailer,
      }),
      invalidatesTags: ['superAdminRetailer'],
    }),
    updateSuperAdminRetailer: builder.mutation({
      query: ({ id, formData }: any) => ({
        url: `/api/secret-root/admin/super-admin/manage-retailer/${id}`,
        method: 'PUT',
        body: formData,
      }),
      invalidatesTags: ['superAdminRetailer'],
    }),
    deleteSuperAdminRetailer: builder.mutation({
      query: (id) => ({
        url: `/api/secret-root/admin/super-admin/manage-retailer/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['superAdminRetailer'],
    }),
  }),
});

export const {
  useGetAllRetailersQuery,
  useCreateSuperAdminRetailerMutation,
  useUpdateSuperAdminRetailerMutation,
  useDeleteSuperAdminRetailerMutation,
} = superAdminRetailerApi;

export default superAdminRetailerApi;
