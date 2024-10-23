import { apiSlice } from '@/features/api/apiSlice';

export const customerApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllRetailerCustomer: builder.query({
      query: (queries) => {
        const values = Object.values(queries);
        if (values.length) return `/api/web/retailer/manage-customer/all?${new URLSearchParams(queries as any)}`;
        return `/api/web/retailer/manage-customer/all`; // Ensure it returns a base URL if no queries are present
      },
    }),
    getSingleCustomerByRetailer: builder.query({
      query: (id) => {
        return `/api/web/retailer/manage-customer/find/${id}`;
      },
    }),
    getAllCustomerScanByRetailer: builder.query({
      query: ({ queries, id }) => {
        const values = Object.values(queries);
        if (values.length) return `/api/web/retailer/manage-customer/scans/${id}?${new URLSearchParams(queries as any)}`;
        return `/api/web/retailer/manage-customer/scans/${id}`; // Ensure it returns a base URL if no queries are present
      },
    }),
  }),
});

export const { useGetAllRetailerCustomerQuery, useGetSingleCustomerByRetailerQuery, useGetAllCustomerScanByRetailerQuery } = customerApi;
