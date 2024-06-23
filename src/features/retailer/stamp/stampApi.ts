import { apiSlice } from '@/features/api/apiSlice';
import { IPagination, IResponse } from '@/types';

export const stampApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllStamps: builder.query<IResponse, IPagination>({
      //   query: ({ page, limit }) => `api/retailer/stamp-/all?page=${page}&limit=${limit}`,
      query: (queries) => {
        const values = Object.values(queries);
        if (values.length) return `/api/retailer/stamp/all?${new URLSearchParams(queries as any)}`;
        return `/api/retailer/stamp-/all`; // Ensure it returns a base URL if no queries are present
      },
      providesTags: ['retailerStamp'],
    }),
    getSingleStamps: builder.query<IResponse, any>({
      query: (id) => {
        return `/api/retailer/stamp/${id}`;
      },
    }),
    createStamp: builder.mutation<IResponse, any>({
      query: (newStamp) => ({
        url: '/api/retailer/stamp',
        method: 'POST',
        body: newStamp,
      }),
      invalidatesTags: ['retailerStamp'],
    }),
    updateStamp: builder.mutation<IResponse, { id: string; formData: FormData }>({
      query: ({ id, formData }: any) => ({
        url: `api/retailer/stamp/${id}`,
        method: 'PUT',
        body: formData,
      }),
      invalidatesTags: ['retailerStamp'],
    }),
    deleteStamp: builder.mutation<IResponse, any>({
      query: (id) => ({
        url: `api/retailer/stamp/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['retailerStamp'],
    }),

    branchCategoryImageList: builder.query<any, any>({
      query: () => {
        return `api/retailer/stamp/branch-category-image-list`;
      },
    }),
    singleBranch: builder.query<{ success: boolean }, { _id: string }>({
      query: ({ _id }) => `/api/retailer/branch/${_id}`,
      providesTags: ['branches'],
    }),
  }),
});

export const {
  useGetAllStampsQuery,
  useCreateStampMutation,
  useUpdateStampMutation,
  useDeleteStampMutation,
  useBranchCategoryImageListQuery,
  useGetSingleStampsQuery,
} = stampApi;

export default stampApi;
