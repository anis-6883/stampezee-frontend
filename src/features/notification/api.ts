import { apiSlice } from '@/features/api/apiSlice';
import { addUser, deleteUser, setValue, updateUser } from '@/features/user/userReducer';
import { IUser } from '@/types';
import hotToast from '@/utils/hotToast';
const userApi = apiSlice.injectEndpoints({
  // @ts-ignore
  overrideExisting: module.hot?.status() === 'apply',
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: (queries) => {
        const values = Object.values(queries);
        if (values.length) return `/user/all?${new URLSearchParams(queries)}`;
        return '/user/all';
      },
      providesTags: ['user'],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const {
            data: { data },
          } = await queryFulfilled;
          if (data.docs) {
            const { docs, ...rest } = data;
            dispatch(setValue({ target: 'users', value: docs }));
            dispatch(setValue({ target: 'pagination', value: rest }));
            return;
          }
          dispatch(setValue({ target: 'users', value: data }));
        } catch (err) {
          console.log(err);
        }
      },
    }),
    getSingleUser: builder.query({
      query: (id) => `/user/profile/${id}`,
    }),
    createUser: builder.mutation<{ data: { user: IUser; status: boolean; message: string } }, IUser>({
      query: (data) => {
        return {
          url: '/user/register',
          method: 'POST',
          body: data,
        };
      },
      invalidatesTags: ['user'],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const {
            data: { data },
          } = await queryFulfilled;
          dispatch(addUser(data.user));
          hotToast('success', 'Added');
        } catch (err) {
          console.log(err);
          hotToast('error', 'Error adding');
        }
      },
    }),
    updateUser: builder.mutation<{ data: { updatedUser: IUser; status: boolean; message: string } }, {}>({
      query: ({ id, data }: { id: string; data: IUser }) => {
        return {
          url: `/user/${id}`,
          method: 'PUT',
          body: data,
        };
      },
      invalidatesTags: ['user'],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const {
            data: { data },
          } = await queryFulfilled;
          dispatch(updateUser(data.updatedUser));
          hotToast('success', 'Updated');
        } catch (err) {
          console.log(err);
          hotToast('error', 'Error updating');
        }
      },
    }),
    deleteUser: builder.mutation<{ data: { deletedUser: IUser; status: boolean; message: string } }, IUser>({
      query: (id) => {
        return {
          url: `/user/${id}`,
          method: 'DELETE',
        };
      },
      invalidatesTags: ['user'],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const {
            data: { data },
          } = await queryFulfilled;
          dispatch(deleteUser({ id: data.deletedUser.id! }));
          hotToast('success', 'Deleted');
        } catch (err) {
          console.log(err);
          hotToast('error', 'Error Deleting');
        }
      },
    }),
  }),
});

export const { useGetUsersQuery, useCreateUserMutation, useGetSingleUserQuery, useUpdateUserMutation, useDeleteUserMutation } = userApi;
