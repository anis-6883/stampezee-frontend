import { apiSlice } from '@/features/api/apiSlice';
import { IPagination, IResponse } from '@/types';

export const superAdminRetailerApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllRetailers: builder.query<IResponse, IPagination>({
      query: (queries) => {
        const values = Object.values(queries);
        if (values.length) return `api/secret-root/admin/super-admin/manage-retailer/all?${new URLSearchParams(queries as any)}`;
        return `api/secret-root/admin/super-admin/manage-retailer/all`; // Ensure it returns a base URL if no queries are present
      },
      providesTags: ['superAdminRetailer'],
    }),
  }),
});

export const { useGetAllRetailersQuery } = superAdminRetailerApi;

export default superAdminRetailerApi;
