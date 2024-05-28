import { apiSlice } from '@/features/api/apiSlice';
import { IAllBranchQueryArgs, ICreateSubAdmin, IDeleteSubAdmin, IResponse, ISubAdminResponse, IUpdateSubAdmin } from '@/types';

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
    getAllSubAdmins: builder.query<ISubAdminResponse, IAllBranchQueryArgs>({
      //   query: ({ page, limit }) => `api/retailer/sub-admin/all?page=${page}&limit=${limit}`,
      query: (queries) => {
        const values = Object.values(queries);
        if (values.length) return `/api/retailer/sub-admin/all?${new URLSearchParams(queries as any)}`;
        return `/api/retailer/sub-admin/all`; // Ensure it returns a base URL if no queries are present
      },
    }),
    createSubAdmin: builder.mutation<IResponse, ICreateSubAdmin>({
      query: (newSubAdmin) => ({
        url: 'api/retailer/sub-admin',
        method: 'POST',
        body: newSubAdmin,
      }),
    }),
    updateSubAdmin: builder.mutation<IResponse, IUpdateSubAdmin>({
      query: ({ id, ...updatedSubAdmin }) => ({
        url: `api/retailer/sub-admin/${id}`,
        method: 'PUT',
        body: updatedSubAdmin,
      }),
    }),
    deleteSubAdmin: builder.mutation<IResponse, IDeleteSubAdmin>({
      query: ({ id }) => ({
        url: `api/retailer/sub-admin/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const { useGetAllSubAdminsQuery, useCreateSubAdminMutation, useUpdateSubAdminMutation, useDeleteSubAdminMutation } = subAdminApi;

export default subAdminApi;
