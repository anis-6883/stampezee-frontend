// import { apiSlice } from "@/features/api/apiSlice";

// export const liveMatchApi = apiSlice.injectEndpoints({
//   endpoints: (builder) => ({
//     getLiveMatches: builder.query({
//       query: () => "/admin/matches",
//       providesTags: ["liveMatches"]
//     }),
//     getLiveMatch: builder.query({
//       query: (id) => `/admin/matches/${id}`,
//       providesTags: (result, error, arg) => [{ type: "liveMatch", id: arg }]
//     }),
//     createLiveMatch: builder.mutation<{}, FormData>({
//       query: (data) => {
//         return {
//           url: "/admin/matches/create",
//           method: "POST",
//           body: data
//           // credentials: 'include',
//         };
//       },
//       invalidatesTags: ["liveMatches"]
//     }),
//     updateLiveMatch: builder.mutation({
//       query: ({ id, data }) => {
//         return {
//           url: `/admin/matches/${id}`,
//           method: "PUT",
//           body: data
//           // credentials: 'include',
//         };
//       },
//       invalidatesTags: (result, error, arg: any) => ["liveMatches", { type: "liveMatch", id: arg.id }]
//     }),
//     deleteLiveMatch: builder.mutation({
//       query: (id) => ({
//         url: `/admin/matches/${id}`,
//         method: "DELETE"
//       }),
//       invalidatesTags: ["liveMatches"]
//     })
//   })
// });

// export const {
//   useGetLiveMatchQuery,
//   useGetLiveMatchesQuery,
//   useCreateLiveMatchMutation,
//   useUpdateLiveMatchMutation,
//   useDeleteLiveMatchMutation
// } = liveMatchApi;
