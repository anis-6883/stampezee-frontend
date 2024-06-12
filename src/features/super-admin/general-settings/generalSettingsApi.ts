import { apiSlice } from '@/features/api/apiSlice';

export const generalSettingsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getGeneralSettings: builder.query({
      query: () => '/api/secret-root/admin/super-admin/settings',
    }),
    updateGeneralSettings: builder.mutation({
      query: (data) => {
        return {
          url: `/api/secret-root/admin/super-admin/settings`,
          method: 'PUT',
          body: data,
          // credentials: 'include',
        };
      },
    }),
  }),
});

export const { useGetGeneralSettingsQuery, useUpdateGeneralSettingsMutation } = generalSettingsApi;
