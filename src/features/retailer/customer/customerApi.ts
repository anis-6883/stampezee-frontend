import { apiSlice } from '@/features/api/apiSlice';

export const customerApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllCustomer: builder.query({
      query: (queries) => {
        const values = Object.values(queries);
        if (values.length) return `/api/web/retailer/manage-customer/all?${new URLSearchParams(queries as any)}`;
        return `/api/web/retailer/manage-customer/all`; // Ensure it returns a base URL if no queries are present
      },
      //   providesTags: ['subAdmin'],
    }),
  }),
});

export const { useGetAllCustomerQuery } = customerApi;
