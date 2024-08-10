import { apiSlice } from '@/features/api/apiSlice';
import { IPagination, IResponse } from '@/types';

export const stampApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllStamps: builder.query<IResponse, IPagination>({
      //   query: ({ page, limit }) => `api/retailer/stamp-/all?page=${page}&limit=${limit}`,
      query: (queries) => {
        const values = Object.values(queries);
        if (values.length) return `/api/web/retailer/stamp/all?${new URLSearchParams(queries as any)}`;
        return `/api/web/retailer/stamp-/all`; // Ensure it returns a base URL if no queries are present
      },
      providesTags: ['retailerStamp'],
    }),
    getSingleStamps: builder.query<IResponse, any>({
      query: (id) => {
        return `/api/web/retailer/stamp/${id}`;
      },
      providesTags: ['retailerStamp'],
    }),
    createStamp: builder.mutation<IResponse, any>({
      query: (newStamp) => ({
        url: '/api/web/retailer/stamp',
        method: 'POST',
        body: newStamp,
      }),
      invalidatesTags: ['retailerStamp'],
    }),
    updateStamp: builder.mutation<IResponse, { id: string; formData: FormData }>({
      query: ({ id, formData }: any) => ({
        url: `/api/web/retailer/stamp/${id}`,
        method: 'PUT',
        body: formData,
      }),
      invalidatesTags: ['retailerStamp'],
    }),
    updateStampStatus: builder.mutation<IResponse, any>({
      query: ({ data, branchId }) => ({
        url: `/api/web/retailer/stamp/status/${branchId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['retailerStamp'],
    }),
    publishStamp: builder.mutation<IResponse, any>({
      query: (id) => ({
        url: `/api/web/retailer/stamp/publish/${id}`,
        method: 'PUT',
      }),
      invalidatesTags: ['retailerStamp'],
    }),
    deleteStamp: builder.mutation<IResponse, any>({
      query: (id) => ({
        url: `/api/web/retailer/stamp/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['retailerStamp'],
    }),

    branchCategoryImageList: builder.query<any, any>({
      query: () => {
        return `/api/web/retailer/stamp/branch-category-image-list`;
      },
      providesTags: ['branches', 'superAdminRetailerStampCategory', 'retailerStamp'],
    }),
    singleBranch: builder.query<{ success: boolean }, { _id: string }>({
      query: ({ _id }) => `/api/web/retailer/branch/${_id}`,
      providesTags: ['branches'],
    }),
  }),
});

export const {
  useGetAllStampsQuery,
  useCreateStampMutation,
  useUpdateStampMutation,
  usePublishStampMutation,
  useDeleteStampMutation,
  useBranchCategoryImageListQuery,
  useGetSingleStampsQuery,
  useUpdateStampStatusMutation,
} = stampApi;

export default stampApi;
