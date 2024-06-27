import { apiSlice } from '@/features/api/apiSlice';

export const faqsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllFaqs: builder.query({
      query: () => '/api/web/faqs',
      providesTags: ['faq'],
    }),
  }),
});

export const { useGetAllFaqsQuery } = faqsApi;

export default faqsApi;
