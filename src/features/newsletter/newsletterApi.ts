import { apiSlice } from '@/features/api/apiSlice';

export const newsletterApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createNewsletter: builder.mutation({
      query: (data) => ({
        url: '/api/web/newsletter/join',
        method: 'POST',
        body: data,
      }),
      //   invalidatesTags: ['faq'],
    }),
  }),
});

export const { useCreateNewsletterMutation } = newsletterApi;

export default newsletterApi;
