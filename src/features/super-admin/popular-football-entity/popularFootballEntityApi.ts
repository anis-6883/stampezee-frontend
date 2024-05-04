import { apiSlice } from '@/features/api/apiSlice';

export const popularFootballEntityApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPopularLeagues: builder.query({
      query: () => '/admin/popular-leagues',
    }),
    getAllLeagues: builder.query({
      query: () => '/v3/football/leagues?include=country;currentSeason',
    }),
  }),
});

export const { useGetAllLeaguesQuery, useGetPopularLeaguesQuery } = popularFootballEntityApi;
