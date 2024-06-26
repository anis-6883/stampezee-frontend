import { apiSlice } from '@/features/api/apiSlice';

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    logoutUser: builder.mutation({
      query: () => {
        return {
          url: '/api/web/user-logout',
          method: 'POST',
        };
      },
    }),

    getOwnProfile: builder.query({
      query: () => `/api/web/get-profile`,
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
      query: () => `api/web/retailer/profile`,
      providesTags: ['retailerProfile'],
    }),
    retailerUpdateProfile: builder.mutation({
      query: (data) => {
        return {
          url: `api/web/retailer/profile`,
          method: 'PUT',
          body: data,
        };
      },
      invalidatesTags: ['userOwnProfile'],
    }),
    retailerRegister: builder.mutation({
      query: (data) => {
        return {
          url: `api/web/retailer/register`,
          method: 'POST',
          body: data,
        };
      },
    }),
    retailerOtpVerify: builder.mutation({
      query: (data) => {
        return {
          url: `api/web/retailer/otp-verify`,
          method: 'POST',
          body: data,
        };
      },
    }),
    retailerResendOtp: builder.mutation({
      query: (data) => {
        return {
          url: `api/web/retailer/resend-otp`,
          method: 'POST',
          body: data,
        };
      },
    }),
    retailerLogin: builder.mutation({
      query: (data) => {
        return {
          url: `/api/web/retailer/login`,
          method: 'POST',
          body: data,
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
  useRetailerUpdateProfileMutation,
  useRetailerLoginMutation,
  useRetailerOtpVerifyMutation,
  useRetailerRegisterMutation,
  useGetOwnProfileQuery,
  useLogoutUserMutation,
  useRetailerResendOtpMutation,
} = authApi;
