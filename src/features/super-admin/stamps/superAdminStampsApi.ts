import { apiSlice } from '@/features/api/apiSlice';
import { IPagination, IResponse } from '@/types';

export const superAdminStampsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllSuperAdminStamps: builder.query<IResponse, IPagination>({
      //   query: ({ page, limit }) => `api/retailer/stamp-/all?page=${page}&limit=${limit}`,
      query: (queries) => {
        const values = Object.values(queries);
        if (values.length) return `/api/secret-root/admin/super-admin/stamp-card/all?${new URLSearchParams(queries as any)}`;
        return `/api/secret-root/admin/super-admin/stamp-card/all`; // Ensure it returns a base URL if no queries are present
      },
      providesTags: ['superAdminStamps', 'branches'],
    }),
    getSuperAdminSingleStamps: builder.query<IResponse, any>({
      query: (id) => {
        return `/api/secret-root/admin/super-admin/stamp-card/${id}`;
      },
      providesTags: ['superAdminSingleStamp', 'branches'],
    }),
    deleteSuperAdminStamp: builder.mutation<IResponse, any>({
      query: (id) => ({
        url: `/api/secret-root/admin/super-admin/stamp-card/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['superAdminStamps'],
    }),
    superAdminBranchCategoryImageList: builder.query<any, any>({
      query: ({ id }) => {
        console.log(id);
        return `/api/secret-root/admin/super-admin/stamp-card/branch-category-image-list?retailerId=${id}`;
      },
      providesTags: ['branches', 'superAdminRetailerStampCategory', 'retailerStamp'],
    }),
    updateSuperAdminStamp: builder.mutation<IResponse, { id: string; formData: FormData; retailerId: string }>({
      query: ({ id, formData, retailerId }: any) => ({
        url: `/api/secret-root/admin/super-admin/stamp-card/${id}?retailerId=${retailerId}`,
        method: 'PUT',
        body: formData,
      }),
      invalidatesTags: ['superAdminStamps', 'superAdminSingleStamp'],
    }),
  }),
});

export const {
  useGetAllSuperAdminStampsQuery,
  useDeleteSuperAdminStampMutation,
  useSuperAdminBranchCategoryImageListQuery,
  useGetSuperAdminSingleStampsQuery,
  useUpdateSuperAdminStampMutation,
} = superAdminStampsApi;

export default superAdminStampsApi;
