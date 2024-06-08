import { apiSlice } from '@/features/api/apiSlice';

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    logoutUser: builder.mutation({
      query: () => {
        return {
          url: '/api/user-logout',
          method: 'POST',
        };
      },
    }),

    getOwnProfile: builder.query({
      query: () => `/api/get-profile`,
      providesTags: ['userOwnProfile'],
    }),

    // super-admin api start
    superAdminLogin: builder.mutation({
      query: (data) => {
        return {
          url: `/api/secret-root/admin/super-admin/login`,
          method: 'POST',
          body: data,
        };
      },
      invalidatesTags: ['superAdminProfile'],
    }),
    superAdminLogout: builder.mutation({
      query: () => {
        return {
          url: '/api/secret-root/admin/super-admin/logout',
          method: 'POST',
        };
      },
      invalidatesTags: ['superAdminProfile'],
    }),
    superAdminGetProfile: builder.query({
      query: (id: string) => `/api/secret-root/admin/super-admin/profile`,
      providesTags: ['superAdminProfile'],
    }),

    // retailer api start
    retailerGetProfile: builder.query({
      query: () => `api/retailer/profile`,
      providesTags: ['retailerProfile'],
    }),
    retailerRegister: builder.mutation({
      query: (data) => {
        return {
          url: `api/retailer/register`,
          method: 'POST',
          body: data,
        };
      },
    }),
    retailerOtpVerify: builder.mutation({
      query: (data) => {
        return {
          url: `api/retailer/otp-verify`,
          method: 'POST',
          body: data,
        };
      },
    }),
    retailerLogin: builder.mutation({
      query: (data) => {
        return {
          url: `/api/retailer/login`,
          method: 'POST',
          body: data,
        };
      },
    }),
    retailerLogout: builder.mutation({
      query: () => {
        return {
          url: '/api/v1/retailer/logout',
          method: 'POST',
        };
      },
    }),
  }),
});

export const {
  useSuperAdminGetProfileQuery,
  useSuperAdminLoginMutation,
  useSuperAdminLogoutMutation,
  useRetailerGetProfileQuery,
  useRetailerLoginMutation,
  useRetailerLogoutMutation,
  useRetailerOtpVerifyMutation,
  useRetailerRegisterMutation,
  useGetOwnProfileQuery,
  useLogoutUserMutation,
} = authApi;
