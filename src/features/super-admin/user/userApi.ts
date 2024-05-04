import { apiSlice } from '@/features/api/apiSlice';

export const userApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => '/admin/users',
    }),
    deleteUser: builder.mutation({
      query: (id) => {
        return {
          url: `/admin/users/${id}`,
          method: 'DELETE',
        };
      },
    }),
  }),
});

export const { useGetUsersQuery, useDeleteUserMutation } = userApi;
