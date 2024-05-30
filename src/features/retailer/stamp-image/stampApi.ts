import { apiSlice } from '@/features/api/apiSlice';
import { ICreateStampImage, IDeleteStampImage, IPagination, IResponse, IUpdateStampImage } from '@/types';
// data json response
// {
//     "status": true,
//     "message": "Sub Admins fetched successfully!",
//     "data": {
//         "docs": [],
//         "page": 1,
//         "limit": 10,
//         "totalPage": 0,
//         "totalDocs": 0,
//         "hasNext": false,
//         "hasPrev": false
//     }
// }

// api endpoint
// api/retailer/stamp-image/all?page=1&limit=10 get all-data
// api/retailer/stamp-image post data create
// api/retailer/stamp-image/6649ecee76fb4665d4c053db  put data update
// api/retailer/stamp-image/6649d97d6ae50d2093a088d9 delete data delete

export const stampApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllStampImages: builder.query<IResponse, IPagination>({
      //   query: ({ page, limit }) => `api/retailer/stamp-image/all?page=${page}&limit=${limit}`,
      query: (queries) => {
        const values = Object.values(queries);
        if (values.length) return `/api/retailer/stamp-image/all?${new URLSearchParams(queries as any)}`;
        return `/api/retailer/stamp-image/all`; // Ensure it returns a base URL if no queries are present
      },
      providesTags: ['retailerStamp'],
    }),
    createStampImage: builder.mutation<IResponse, ICreateStampImage>({
      query: (newStampImage) => ({
        url: '/api/retailer/stamp-image',
        method: 'POST',
        body: newStampImage,
      }),
      invalidatesTags: ['retailerStamp'],
    }),
    updateStampImage: builder.mutation<IResponse, { id: string; formData: FormData }>({
      query: ({ id, formData }: any) => ({
        url: `api/retailer/stamp-image/${id}`,
        method: 'PUT',
        body: formData,
      }),
      invalidatesTags: ['retailerStamp'],
    }),
    deleteStampImage: builder.mutation<IResponse, IDeleteStampImage>({
      query: ({ id }) => ({
        url: `api/retailer/stamp-image/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['retailerStamp'],
    }),
  }),
});

export const { useGetAllStampImagesQuery, useCreateStampImageMutation, useUpdateStampImageMutation, useDeleteStampImageMutation } =
  stampApi;

export default stampApi;
