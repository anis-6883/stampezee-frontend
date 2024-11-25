import { apiSlice } from '@/features/api/apiSlice';

export const newsletterApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllNewsletterBySuperAdmin: builder.query({
      query: (queries) => {
        const values = Object.values(queries);
        if (values.length) return `/api/secret-root/admin/super-admin/newsletter/subscribers?${new URLSearchParams(queries as any)}`;
        return `/api/secret-root/admin/super-admin/newsletter/subscribers`; // Ensure it returns a base URL if no queries are present
      },
      //   providesTags: ['subAdmin'],
    }),
  }),
});

export const { useGetAllNewsletterBySuperAdminQuery } = newsletterApi;
