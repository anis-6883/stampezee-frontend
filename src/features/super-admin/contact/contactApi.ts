import { apiSlice } from '@/features/api/apiSlice';

export const contactApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllContactBySuperAdmin: builder.query({
      query: (queries) => {
        const values = Object.values(queries);
        if (values.length) return `/api/secret-root/admin/super-admin/contact/list?${new URLSearchParams(queries as any)}`;
        return `/api/secret-root/admin/super-admin/contact/list`; // Ensure it returns a base URL if no queries are present
      },
      //   providesTags: ['subAdmin'],
    }),
  }),
});

export const { useGetAllContactBySuperAdminQuery } = contactApi;
