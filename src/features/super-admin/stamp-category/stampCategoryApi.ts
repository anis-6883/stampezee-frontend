import { apiSlice } from '@/features/api/apiSlice';

export const superAdminStampImageCategoryApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllSuperAdminStampImagesCategory: builder.query({
      query: (queries) => {
        const values = Object.values(queries);
        if (values.length) return `/api/secret-root/admin/super-admin/category/all?${new URLSearchParams(queries as any)}`;
        return `/api/secret-root/admin/super-admin/category/all`; // Ensure it returns a base URL if no queries are present
      },
      providesTags: ['superAdminRetailerStampCategory'],
    }),
    createSuperAdminStampImageCategory: builder.mutation({
      query: (newStampImage) => ({
        url: '/api/secret-root/admin/super-admin/category',
        method: 'POST',
        body: newStampImage,
      }),
      invalidatesTags: ['superAdminRetailerStampCategory'],
    }),
    updateSuperAdminStampImageCategory: builder.mutation({
      query: ({ id, formData }: any) => ({
        url: `api/secret-root/admin/super-admin/category/${id}`,
        method: 'PUT',
        body: formData,
      }),
    }),
    updateSuperAdminCategoryStatus: builder.mutation({
      query: ({ data, branchId }) => ({
        url: `api/secret-root/admin/super-admin/category/status/${branchId}`,
        method: 'PUT',
        body: data,
      }),
    }),
    deleteSuperAdminStampImageCategory: builder.mutation({
      query: (id) => ({
        url: `api/secret-root/admin/super-admin/category/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['superAdminRetailerStampCategory'],
    }),
  }),
});

export const {
  useGetAllSuperAdminStampImagesCategoryQuery,
  useCreateSuperAdminStampImageCategoryMutation,
  useUpdateSuperAdminStampImageCategoryMutation,
  useDeleteSuperAdminStampImageCategoryMutation,
  useUpdateSuperAdminCategoryStatusMutation,
} = superAdminStampImageCategoryApi;

export default superAdminStampImageCategoryApi;
