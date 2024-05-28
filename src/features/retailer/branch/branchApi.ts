import { apiSlice } from '@/features/api/apiSlice';
import { Branch, IAllBranchQueryArgs, IResponse } from '@/types';

export const branchApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    allBranch: builder.query<IResponse, IAllBranchQueryArgs>({
      query: (queries) => {
        const values = Object.values(queries);
        if (values.length) return `/api/retailer/branch/all?${new URLSearchParams(queries as any)}`;
        return `/api/retailer/branch/all`; // Ensure it returns a base URL if no queries are present
      },
      providesTags: ['retailerBranch'],
    }),
    createBranch: builder.mutation<Branch, Partial<Branch>>({
      query: (data) => ({
        url: `api/retailer/branch`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['retailerBranch'],
    }),
    updateBranch: builder.mutation<Branch, { data: Partial<Branch>; branchId: string }>({
      query: ({ data, branchId }) => ({
        url: `api/retailer/branch/${branchId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['retailerBranch'],
    }),
    deleteBranch: builder.mutation<{ success: boolean }, { _id: string }>({
      query: ({ _id }) => ({
        url: `api/retailer/branch/${_id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['retailerBranch'],
    }),
    singleBranch: builder.query<{ success: boolean }, { _id: string }>({
      query: ({ _id }) => `/api/retailer/branch/${_id}`,
      providesTags: ['retailerBranch'],
    }),
  }),
});

export const { useAllBranchQuery, useCreateBranchMutation, useUpdateBranchMutation, useDeleteBranchMutation, useSingleBranchQuery } =
  branchApi;
