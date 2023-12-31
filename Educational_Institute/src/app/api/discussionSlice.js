import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const discussionSlice = createApi({
    reducerPath: 'discussionApi',
    baseQuery: fetchBaseQuery({baseUrl: 'http://localhost:8800'}),
    tagTypes: ['Discussion'],
    endpoints: (builder) => ({
        getDiscussions: builder.query({
            query: (filter) => ({
              url: '/discussion',
              method: "GET",
              params: filter,
            })
        }),
        postDiscussions: builder.query({
            query: (details) => ({
              url: '/discussion',
              method: "POST",
              params: details,
            })
        }),
        postUserDiscussions: builder.query({
            query: (details) => ({
              url: '/discussion/user/post',
              method: "POST",
              params: details,
            })
        }),
        deleteUserDiscussions: builder.query({
          query: (details) => ({
            url: '/discussion/delete/post',
            method: "POST",
            params: details,
          })
      }),
    })
})

export const {
    useGetDiscussionsQuery, usePostDiscussionsQuery, usePostUserDiscussionsQuery, useDeleteUserDiscussionsQuery
} = discussionSlice