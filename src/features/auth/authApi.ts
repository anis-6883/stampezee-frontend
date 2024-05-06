import { apiSlice } from '@/features/api/apiSlice';

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    adminLogin: builder.mutation({
      query: (data) => {
        return {
          url: `/api/v1/user/login`,
          method: 'POST',
          body: data,
        };
      },
    }),
    logoutUser: builder.mutation({
      query: () => {
        return {
          url: '/api/v1/user/logout',
          method: 'POST',
        };
      },
    }),
    getProfile: builder.query({
      query: (id: string) => `/user/${id}`,
      providesTags: ['userProfile'],
    }),
    getOwnProfile: builder.query({
      query: () => `/api/v1/user/profile`,
      providesTags: ['userOwnProfile'],
    }),
  }),
});

export const { useGetProfileQuery, useAdminLoginMutation, useGetOwnProfileQuery, useLogoutUserMutation } = authApi;
