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
    getSingleCustomerBySuperAdmin: builder.query({
      query: (id) => {
        return `/api/secret-root/admin/super-admin/manage-customer/find/${id}`;
      },
      providesTags: ['superAdminCustomer'],
    }),
    getAllCustomerScanBySuperAdmin: builder.query({
      query: ({ queries, id }) => {
        const values = Object.values(queries);
        if (values.length) return `/api/secret-root/admin/super-admin/manage-customer/scans/${id}?${new URLSearchParams(queries as any)}`;
        return `/api/secret-root/admin/super-admin/manage-customer/scans/${id}`; // Ensure it returns a base URL if no queries are present
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
    updateCustomerBySuperAdmin: builder.mutation({
      query: ({ formData, id }) => ({
        url: `/api/secret-root/admin/super-admin/manage-customer/${id}`,
        method: 'PUT',
        body: formData,
      }),
      invalidatesTags: ['superAdminCustomer'],
    }),
    deleteCustomerBySuperAdmin: builder.mutation({
      query: (id) => ({
        url: `/api/secret-root/admin/super-admin/manage-customer/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['superAdminCustomer'],
    }),
    customerStatusUpdateBySuperAdmin: builder.mutation({
      query: ({ data, branchId }) => ({
        url: `/api/secret-root/admin/super-admin/manage-customer/status/${branchId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['superAdminCustomer'],
    }),
  }),
});

export const {
  useGetAllCustomerBySuperAdminQuery,
  useGetSingleCustomerBySuperAdminQuery,
  useGetAllCustomerScanBySuperAdminQuery,
  useCreateCustomerBySuperAdminMutation,
  useUpdateCustomerBySuperAdminMutation,
  useDeleteCustomerBySuperAdminMutation,
  useCustomerStatusUpdateBySuperAdminMutation,
} = customerApi;
