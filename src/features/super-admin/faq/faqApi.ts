import { apiSlice } from '@/features/api/apiSlice';

export const faqApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllFaq: builder.query({
      query: (queries) => {
        const values = Object.values(queries);
        if (values.length) return `/api/secret-root/admin/super-admin/faq/all?${new URLSearchParams(queries as any)}`;
        return `/api/secret-root/admin/super-admin/faq/all`;
      },
      providesTags: ['faq'],
    }),
    createFaq: builder.mutation({
      query: (newFaq) => ({
        url: '/api/secret-root/admin/super-admin/faq',
        method: 'POST',
        body: newFaq,
      }),
      invalidatesTags: ['faq'],
    }),
    updateFaq: builder.mutation({
      query: ({ id, formData }: any) => ({
        url: `api/secret-root/admin/super-admin/faq/${id}`,
        method: 'PUT',
        body: formData,
      }),
      invalidatesTags: ['faq'],
    }),
    updateSortingFaq: builder.mutation({
      query: (data) => ({
        url: `api/secret-root/admin/super-admin/sort`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['faq'],
    }),
    updateFaqStatus: builder.mutation({
      query: ({ data, branchId }) => ({
        url: `api/secret-root/admin/super-admin/faq/status/${branchId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['faq'],
    }),

    deleteFaq: builder.mutation({
      query: (id) => ({
        url: `api/secret-root/admin/super-admin/faq/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['faq'],
    }),
  }),
});

export const {
  useGetAllFaqQuery,
  useCreateFaqMutation,
  useUpdateFaqMutation,
  useDeleteFaqMutation,
  useUpdateFaqStatusMutation,
  useUpdateSortingFaqMutation,
} = faqApi;

export default faqApi;
