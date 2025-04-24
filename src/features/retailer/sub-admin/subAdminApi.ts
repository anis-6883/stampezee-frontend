import { apiSlice } from '@/features/api/apiSlice';

export const subAdminApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllSubAdmins: builder.query({
      query: (queries) => {
        const values = Object.values(queries);
        if (values.length) return `/api/web/retailer/sub-admin/all?${new URLSearchParams(queries as any)}`;
        return `/api/web/retailer/sub-admin/all`; // Ensure it returns a base URL if no queries are present
      },
      providesTags: ['subAdmin'],
    }),
    getNextEmail: builder.query({
      query: () => `/api/web/retailer/sub-admin/next-email`,
    }),
    subAdminBranches: builder.query({
      query: () => `/api/web/retailer/sub-admin/branches`,
      providesTags: ['subAdminBranches', 'branches'],
    }),
    createSubAdmin: builder.mutation({
      query: (newSubAdmin) => ({
        url: 'api/web/retailer/sub-admin',
        method: 'POST',
        body: newSubAdmin,
      }),
      invalidatesTags: ['subAdmin'],
    }),
    singleSubAdmin: builder.query({
      query: (id) => `api/web/retailer/sub-admin/${id}`,
      providesTags: ['subAdmin'],
    }),
    updateSubAdmin: builder.mutation({
      query: ({ id, data }: any) => ({
        url: `api/web/retailer/sub-admin/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['subAdmin'],
    }),
    updateSubAdminStatus: builder.mutation({
      query: ({ data, branchId }) => ({
        url: `api/web/retailer/sub-admin/status/${branchId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, arg: any) => [{ type: 'branch', id: arg.id }],
    }),
    deleteSubAdmin: builder.mutation({
      query: (id) => ({
        url: `api/web/retailer/sub-admin/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['subAdmin'],
    }),
  }),
});

export const {
  useGetAllSubAdminsQuery,
  useGetNextEmailQuery,
  useCreateSubAdminMutation,
  useUpdateSubAdminMutation,
  useDeleteSubAdminMutation,
  useSingleSubAdminQuery,
  useSubAdminBranchesQuery,
  useUpdateSubAdminStatusMutation,
} = subAdminApi;
