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

    // super-admin api end

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
      invalidatesTags: ['retailerProfile'],
    }),
    retailerOtpVerify: builder.mutation({
      query: (data) => {
        return {
          url: `api/retailer/otp-verify`,
          method: 'POST',
          body: data,
        };
      },
      invalidatesTags: ['retailerProfile'],
    }),
    retailerLogin: builder.mutation({
      query: (data) => {
        return {
          url: `/api/retailer/login`,
          method: 'POST',
          body: data,
        };
      },
      invalidatesTags: ['retailerProfile'],
    }),
    retailerLogout: builder.mutation({
      query: () => {
        return {
          url: '/api/v1/retailer/logout',
          method: 'POST',
        };
      },
      invalidatesTags: ['retailerProfile'],
    }),

    // retailer api end
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
