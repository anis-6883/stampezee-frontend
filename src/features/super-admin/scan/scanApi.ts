import { apiSlice } from '@/features/api/apiSlice';

export const scanApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    superAdminScanDetails: builder.query({
      query: (queries) => {
        const values = Object.values(queries);
        if (values.length) return `/api/secret-root/admin/super-admin/scans/details?${new URLSearchParams(queries as any)}`;
        return `/api/secret-root/admin/super-admin/scans/details`; // Ensure it returns a base URL if no queries are present
      },
      providesTags: ['superAdminScanDetails'],
    }),
  }),
});

export const { useSuperAdminScanDetailsQuery } = scanApi;
