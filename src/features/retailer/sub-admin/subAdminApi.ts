import { apiSlice } from '@/features/api/apiSlice';

export const subAdminApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllSubAdmins: builder.query({
      query: (queries) => {
        const values = Object.values(queries);
        if (values.length) return `/api/retailer/sub-admin/all?${new URLSearchParams(queries as any)}`;
        return `/api/retailer/sub-admin/all`; // Ensure it returns a base URL if no queries are present
      },
      providesTags: ['subAdmin'],
    }),
    subAdminBranches: builder.query({
      query: () => `/api/retailer/sub-admin/branches`,
      providesTags: ['subAdminBranches'],
    }),
    createSubAdmin: builder.mutation({
      query: (newSubAdmin) => ({
        url: 'api/retailer/sub-admin',
        method: 'POST',
        body: newSubAdmin,
      }),
      invalidatesTags: ['subAdmin'],
    }),
    singleSubAdmin: builder.query({
      query: (id) => `api/retailer/sub-admin/${id}`,
      providesTags: ['subAdmin'],
    }),
    updateSubAdmin: builder.mutation({
      query: ({ id, data }: any) => ({
        url: `api/retailer/sub-admin/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['subAdmin'],
    }),
    deleteSubAdmin: builder.mutation({
      query: (id) => ({
        url: `api/retailer/sub-admin/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['subAdmin'],
    }),
  }),
});

export const {
  useGetAllSubAdminsQuery,
  useCreateSubAdminMutation,
  useUpdateSubAdminMutation,
  useDeleteSubAdminMutation,
  useSingleSubAdminQuery,
  useSubAdminBranchesQuery,
} = subAdminApi;
