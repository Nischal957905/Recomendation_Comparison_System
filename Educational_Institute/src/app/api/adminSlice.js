//necessary imports for the endpoint making
import { createApi } from '@reduxjs/toolkit/query/react'
import baseQuery from './baseQuery'

//This function is used for creating the api for the frontend and utilizes various 
//options to allow frontend access data.
export const adminSlice = createApi({
    reducerPath: 'admin',
    baseQuery,
    tagTypes: ['Admin'],
    endpoints: (builder) => ({
        postCollegeNew: builder.query({
            query: (details) => ({
              url: '/admin/new/college',
              method: "POST",
              params: details,
            })
        }),
        postSchoolNew: builder.query({
            query: (details) => ({
              url: '/admin/new/school',
              method: "POST",
              params: details,
            })
        }),
        postConsultancyNew: builder.query({
            query: (details) => ({
              url: '/admin/new/consultancy',
              method: "POST",
              params: details,
            })
        }),
        deletePostAdmin: builder.query({
            query: (details) => ({
              url: '/admin/delete',
              method: "DELETE",
              params: details,
            })
        }),
        getAdminShowList: builder.query({
          query: (details) => ({
            url: '/admin',
            method: "GET",
            params: details,
          })  
        }),
        getUserList: builder.query({
          query: (details) => ({
            url: '/admin/user',
            method: "GET",
            params: details,
          })  
        }),
        editPostInstitution: builder.query({
          query: ({institution,delayedData}) => ({
              url: `/admin/edit/institution/${institution}`,
              method: "POST",
              params: delayedData,
          })
        }),
        editPostSchool: builder.query({
          query: ({institution,delayedData}) => ({
              url: `/admin/edit/school/${institution}`,
              method: "POST",
              params: delayedData,
          })
        }),
        editPostCollege: builder.query({
          query: ({institution,delayedData}) => ({
              url: `/admin/edit/college/${institution}`,
              method: "POST",
              params: delayedData,
            }),
        }),
        editPostUser: builder.query({
          query: ({institution,delayedData}) => ({
              url: `/admin/edit/user/${institution}`,
              method: "POST",
              params: delayedData,
            }),
        }),
        inactivateUser: builder.query({
          query: (user) => ({
              url: `/admin/active`,
              method: "POST",
              params: user,
            }),
        })
    })
})

//Exporting custom hook to be used in the frontend to gain data.
export const {
    usePostCollegeNewQuery,
    usePostSchoolNewQuery,
    usePostConsultancyNewQuery,
    useGetAdminShowListQuery,
    useDeletePostAdminQuery,
    useEditPostCollegeQuery,
    useEditPostInstitutionQuery,
    useEditPostSchoolQuery,
    useGetUserListQuery,
    useEditPostUserQuery,
    useInactivateUserQuery
} = adminSlice
