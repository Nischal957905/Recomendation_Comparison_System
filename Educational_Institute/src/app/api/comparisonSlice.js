import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const comparisonSlice = createApi({
    reducerPath: 'comparisonApi',
    baseQuery: fetchBaseQuery({baseUrl: 'http://localhost:8800'}),
    tagTypes: ['Comparison'],
    endpoints: (builder) => ({
        getComparisons: builder.query({
            query: (comparables) => ({
              url: '/comparison',
              method: "GET",
              params: comparables,
            })
        }),
        getComparisonCollege: builder.query({
            query: (comparables) => ({
              url: '/comparison/college',
              method: "GET",
              params: comparables,
            })
        }),
        getComparisonSchool: builder.query({
            query: (comparables) => ({
              url: '/comparison/school',
              method: "GET",
              params: comparables,
            })
        }),
        getCompany: builder.query({
            query: (id) => `/comparison/${id}`, // Assuming this is your endpoint for fetching a single company
        }),
    })
})

export const {
    useGetComparisonsQuery,
    useLazyGetComparisonsQuery,
    useGetCompanyQuery,
    useGetComparisonCollegeQuery,
    useLazyGetComparisonCollegeQuery,
    useGetComparisonSchoolQuery,
    useLazyGetComparisonSchoolQuery,
} = comparisonSlice
