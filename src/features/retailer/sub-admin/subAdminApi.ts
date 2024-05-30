import { apiSlice } from '@/features/api/apiSlice';
import { ICreateSubAdmin, IDeleteSubAdmin, IPagination, IResponse, ISubAdminResponse, IUpdateSubAdmin } from '@/types';

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
// api/retailer/sub-admin/all?page=1&limit=10 get all-data
// api/retailer/sub-admin post data create
// api/retailer/sub-admin/6649ecee76fb4665d4c053db  put data update
// api/retailer/sub-admin/6649d97d6ae50d2093a088d9 delete data delete

export const subAdminApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllSubAdmins: builder.query<ISubAdminResponse, IPagination>({
      //   query: ({ page, limit }) => `api/retailer/sub-admin/all?page=${page}&limit=${limit}`,
      query: (queries) => {
        const values = Object.values(queries);
        if (values.length) return `/api/retailer/sub-admin/all?${new URLSearchParams(queries as any)}`;
        return `/api/retailer/sub-admin/all`; // Ensure it returns a base URL if no queries are present
      },
      providesTags: ['subAdmin'],
    }),
    createSubAdmin: builder.mutation<IResponse, ICreateSubAdmin>({
      query: (newSubAdmin) => ({
        url: 'api/retailer/sub-admin',
        method: 'POST',
        body: newSubAdmin,
      }),
      invalidatesTags: ['subAdmin'],
    }),
    singleSubAdmin: builder.query<IResponse, string>({
      query: (id) => `api/retailer/sub-admin/${id}`,
      providesTags: ['subAdmin'],
    }),
    updateSubAdmin: builder.mutation<IResponse, IUpdateSubAdmin>({
      query: ({ id, updateSubAdminData }: any) => ({
        url: `api/retailer/sub-admin/${id}`,
        method: 'PUT',
        body: updateSubAdminData,
      }),
      invalidatesTags: ['subAdmin'],
    }),

    deleteSubAdmin: builder.mutation<IResponse, IDeleteSubAdmin>({
      query: ({ id }) => ({
        url: `api/retailer/sub-admin/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['subAdmin'],
    }),
  }),
});

export const {
  useGetAllSubAdminsQuery,
  useCreateSubAdminMutation,
  useUpdateSubAdminMutation,
  useDeleteSubAdminMutation,
  useSingleSubAdminQuery,
} = subAdminApi;

export default subAdminApi;
