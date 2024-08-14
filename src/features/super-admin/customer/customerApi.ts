import { apiSlice } from '@/features/api/apiSlice';

export const customerApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllCustomerBySuperAdmin: builder.query({
      query: (queries) => {
        const values = Object.values(queries);
        if (values.length) return `/api/secret-root/admin/super-admin/manage-customer/all?${new URLSearchParams(queries as any)}`;
        return `/api/secret-root/admin/super-admin/manage-customer/all`; // Ensure it returns a base URL if no queries are present
      },
      providesTags: ['superAdminCustomer'],
    }),
    createCustomerBySuperAdmin: builder.mutation({
      query: (newCustomer) => ({
        url: '/api/secret-root/admin/super-admin/manage-customer/create',
        method: 'POST',
        body: newCustomer,
      }),
      invalidatesTags: ['superAdminCustomer'],
    }),
  }),
});

export const { useGetAllCustomerBySuperAdminQuery, useCreateCustomerBySuperAdminMutation } = customerApi;
