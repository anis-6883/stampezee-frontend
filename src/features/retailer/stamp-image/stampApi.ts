import { apiSlice } from '@/features/api/apiSlice';

export const stampApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllStampImages: builder.query({
      //   query: ({ page, limit }) => `api/retailer/stamp-image/all?page=${page}&limit=${limit}`,
      query: (queries) => {
        const values = Object.values(queries);
        if (values.length) return `/api/web/retailer/stamp-image/all?${new URLSearchParams(queries as any)}`;
        return `/api/web/retailer/stamp-image/all`; // Ensure it returns a base URL if no queries are present
      },
      providesTags: ['retailerStamp'],
    }),
    createStampImage: builder.mutation({
      query: (newStampImage) => ({
        url: '/api/web/retailer/stamp-image',
        method: 'POST',
        body: newStampImage,
      }),
      invalidatesTags: ['retailerStamp'],
    }),
    updateStampImage: builder.mutation({
      query: ({ id, data }: any) => ({
        url: `/api/web/retailer/stamp-image/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['retailerStamp'],
    }),
    updateStampStatus: builder.mutation({
      query: ({ data, branchId }) => ({
        url: `/api/web/retailer/stamp-image/status/${branchId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['retailerStamp'],
    }),
    deleteStampImage: builder.mutation({
      query: (id) => ({
        url: `/api/web/retailer/stamp-image/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['retailerStamp'],
    }),
  }),
});

export const {
  useGetAllStampImagesQuery,
  useCreateStampImageMutation,
  useUpdateStampImageMutation,
  useDeleteStampImageMutation,
  useUpdateStampStatusMutation,
} = stampApi;

export default stampApi;
