//necessary imports for the endpoint making
import { createApi } from '@reduxjs/toolkit/query/react'
import baseQuery from './baseQuery'

//This function is used for creating the api for the frontend and utilizes various 
//options to allow frontend access data.
export const appSlice = createApi({
    reducerPath: 'api',
    baseQuery,
    tagTypes: ['Institution'],
    endpoints: (builder) => ({
        getInstitutions: builder.query({
            query: (filters) => ({
                url: "/institution",
                method: "GET",
                params: filters,
            }),
        }),
        getColleges: builder.query({
            query: (filters) => ({
                url: "/college",
                method: "GET",
                params: filters,
            }),
        }),
        getSchools: builder.query({
            query: (filters) => ({
                url: "/school",
                method: "GET",
                params: filters,
            }),
        }),
        getInstitutionsOnFilter: builder.query({
            query: (filters) => ({
              url: "/institution",
              method: "GET",
              params: filters,
            }),
        }),
        getCollegesOnFilter: builder.query({
            query: (filters) => ({
              url: "/college",
              method: "GET",
              params: filters,
            }),
        }),
        getInstitutionsOnAdditionalFilter: builder.query({
            query: (filters) => ({
                url: '/institution',
                method: "GET",
                params: filters,
            }),
        }),
        getCollegesOnAdditionalFilter: builder.query({
            query: (additional) => ({
                url: '/college',
                method: "GET",
                params: additional,
            }),
        }),
        getSingleInstitution: builder.query({
            query: (institution) => `/institution/${institution}`,
        }),
        getSingleCollege: builder.query({
            query: (college) => `/college/${college}`,
        }),
        getSingleSchool: builder.query({
            query: (school) => `/school/${school}`,
        }),
        postReview: builder.query({
            query: ({institution,delayedData}) => ({
                url: `/institution/${institution}`,
                method: "POST",
                params: delayedData,
              }),
        })
    })
})

//Exporting custom hook to be used in the frontend to gain data.
export const {
    useGetInstitutionsQuery,
    useGetInstitutionsOnFilterQuery, 
    useGetInstitutionsOnAdditionalFilterQuery,
    useGetSingleInstitutionQuery,
    useGetCollegesQuery,
    useGetSingleCollegeQuery,
    useGetCollegesOnFilterQuery,
    useGetCollegesOnAdditionalFilterQuery,
    usePostReviewQuery,
    useGetSchoolsQuery,
    useGetSingleSchoolQuery,
} = appSlice
