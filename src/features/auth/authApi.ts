import { apiSlice } from "@/features/api/apiSlice";

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    adminLogin: builder.mutation({
      query: (data) => {
        return {
          url: `/api/v1/admin/login`,
          method: "POST",
          body: data
        };
      }
    }),
    getProfile: builder.query({
      query: (id: string) => `/admin/${id}`,
      providesTags: ["userProfile"]
    }),
    getOwnProfile: builder.mutation({
      query: () => "/api/v1/admin/profile"
    }),
    logoutUser: builder.mutation({
      query: () => {
        return {
          url: "/api/v1/admin/logout",
          method: "POST"
        };
      }
    })
  })
});

export const { useGetProfileQuery, useAdminLoginMutation, useGetOwnProfileMutation, useLogoutUserMutation } = authApi;
