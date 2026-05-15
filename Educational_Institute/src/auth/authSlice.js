import { createApi } from '@reduxjs/toolkit/query/react'
import baseQuery from '../app/api/baseQuery'

export const authSlice = createApi({
    reducerPath: 'auth',
    baseQuery,
    tagTypes: ['Auth'],
    endpoints: (builder) => ({
        postLogin: builder.query({
            query: (credentials) => ({
              url: '/auth/login',
              method: "POST",
              body: credentials,
            })
        }),
        postRegister: builder.query({
            query: (credentials) => ({
              url: '/auth/register',
              method: "POST",
              body: credentials,
            })
        }),
    })
})

export const {
    usePostLoginQuery,
    useLazyPostLoginQuery,
    usePostRegisterQuery,
    useLazyPostRegisterQuery
} = authSlice
