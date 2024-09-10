import { apiSlice } from '@/features/api/apiSlice';

export const currencyApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllCurrency: builder.query({
      query: (queries) => {
        const values = Object.values(queries);
        if (values.length) return `/api/secret-root/admin/super-admin/currency-exchange/all?${new URLSearchParams(queries as any)}`;
        return `/api/secret-root/admin/super-admin/currency-exchange/all`; // Ensure it returns a base URL if no queries are present
      },
      providesTags: ['currency'],
    }),
    createCurrency: builder.mutation({
      query: (data) => ({
        url: '/api/secret-root/admin/super-admin/currency-exchange',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['currency'],
    }),
    updateCurrency: builder.mutation({
      query: ({ id, formData }: any) => ({
        url: `/api/secret-root/admin/super-admin/currency-exchange/${id}`,
        method: 'PUT',
        body: formData,
      }),
      invalidatesTags: ['currency'],
    }),
    updateCurrencyStatus: builder.mutation({
      query: ({ data, branchId }) => ({
        url: `/api/secret-root/admin/super-admin/currency-exchange/status/${branchId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['currency'],
    }),
    deleteCurrency: builder.mutation({
      query: (id) => ({
        url: `/api/secret-root/admin/super-admin/currency-exchange/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['currency'],
    }),
  }),
});

export const {
  useGetAllCurrencyQuery,
  useCreateCurrencyMutation,
  useUpdateCurrencyMutation,
  useDeleteCurrencyMutation,
  useUpdateCurrencyStatusMutation,
} = currencyApi;

export default currencyApi;
