import { apiSlice } from '@/features/api/apiSlice';

export const branchApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    allBranch: builder.query({
      query: (queries) => {
        const values = Object.values(queries);
        if (values.length) return `/api/web/retailer/branch/all?${new URLSearchParams(queries as any)}`;
        return `/api/web/retailer/branch/all`; // Ensure it returns a base URL if no queries are present
      },
      providesTags: ['branches'],
      keepUnusedDataFor: 0,
    }),
    singleBranch: builder.query({
      query: ({ _id }) => `/api/web/retailer/branch/${_id}`,
      providesTags: (result, error, arg) => [{ type: 'branch', id: arg }],
    }),
    createBranch: builder.mutation({
      query: (data) => ({
        url: `/api/web/retailer/branch`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['branches'],
    }),
    updateBranch: builder.mutation({
      query: ({ data, branchId }) => ({
        url: `/api/web/retailer/branch/${branchId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, arg: any) => ['branches', { type: 'branch', id: arg.id }],
    }),
    updateBranchStatus: builder.mutation({
      query: ({ data, branchId }) => ({
        url: `/api/web/retailer/branch/status/${branchId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, arg: any) => ['branches', { type: 'branch', id: arg.id }],
    }),
    deleteBranch: builder.mutation({
      query: (id) => ({
        url: `/api/web/retailer/branch/${id}`,
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
