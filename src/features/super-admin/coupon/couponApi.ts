import { apiSlice } from '@/features/api/apiSlice';

export const couponApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllCoupon: builder.query({
      query: (queries) => {
        const values = Object.values(queries);
        if (values.length) return `/api/secret-root/admin/super-admin/coupon/all?${new URLSearchParams(queries as any)}`;
        return `/api/secret-root/admin/super-admin/coupon/all`; // Ensure it returns a base URL if no queries are present
      },
      providesTags: ['coupons'],
    }),
    createCouponAdmin: builder.mutation({
      query: (data) => ({
        url: '/api/secret-root/admin/super-admin/coupon',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['coupons'],
    }),
    getAllCouponRetailers: builder.query({
      query: (queries) => {
        const values = Object.values(queries);
        if (values.length) return `/api/secret-root/admin/super-admin/coupon/all-retailers?${new URLSearchParams(queries as any)}`;
        return `/api/secret-root/admin/super-admin/coupon/all-retailers`; // Ensure it returns a base URL if no queries are present
      },
      keepUnusedDataFor: 0,
    }),
    updateCoupon: builder.mutation({
      query: ({ id, formData }: any) => ({
        url: `api/secret-root/admin/super-admin/coupon/${id}`,
        method: 'PUT',
        body: formData,
      }),
      invalidatesTags: ['coupons'],
    }),
    updateCouponStatus: builder.mutation({
      query: ({ data, branchId }) => ({
        url: `api/secret-root/admin/super-admin/coupon/status/${branchId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['coupons'],
    }),
    deleteCoupon: builder.mutation({
      query: (id) => ({
        url: `api/secret-root/admin/super-admin/coupon/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['coupons'],
    }),
  }),
});

export const {
  useGetAllCouponQuery,
  useGetAllCouponRetailersQuery,
  useCreateCouponAdminMutation,
  useUpdateCouponMutation,
  useDeleteCouponMutation,
  useUpdateCouponStatusMutation,
} = couponApi;

export default couponApi;
