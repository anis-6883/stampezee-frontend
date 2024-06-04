import { apiSlice } from '@/features/api/apiSlice';

export const branchApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    allBranch: builder.query({
      query: (queries) => {
        const values = Object.values(queries);
        if (values.length) return `/api/retailer/branch/all?${new URLSearchParams(queries as any)}`;
        return `/api/retailer/branch/all`; // Ensure it returns a base URL if no queries are present
      },
      providesTags: ['branches'],
    }),
    singleBranch: builder.query({
      query: ({ _id }) => `/api/retailer/branch/${_id}`,
      providesTags: (result, error, arg) => [{ type: 'branch', id: arg }],
    }),
    createBranch: builder.mutation({
      query: (data) => ({
        url: `api/retailer/branch`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['branches'],
    }),
    updateBranch: builder.mutation({
      query: ({ data, branchId }) => ({
        url: `api/retailer/branch/${branchId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, arg: any) => ['branches', { type: 'branch', id: arg.id }],
    }),
    updateBranchStatus: builder.mutation({
      query: ({ data, branchId }) => ({
        url: `api/retailer/branch/status/${branchId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, arg: any) => [{ type: 'branch', id: arg.id }],
    }),
    deleteBranch: builder.mutation({
      query: (id) => ({
        url: `api/retailer/branch/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, arg: any) => ['branches', { type: 'branch', id: arg.id }],
    }),
  }),
});

export const {
  useAllBranchQuery,
  useCreateBranchMutation,
  useUpdateBranchMutation,
  useDeleteBranchMutation,
  useSingleBranchQuery,
  useUpdateBranchStatusMutation,
} = branchApi;
