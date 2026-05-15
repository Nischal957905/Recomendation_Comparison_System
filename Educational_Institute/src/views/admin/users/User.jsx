import { useGetUserListQuery, useInactivateUserQuery } from '../../../app/api/adminSlice'
import AdminUserTable from '../../../components/utilities/AdminUserTable'
import { useEffect, useState } from "react"

export default function User(){

    const {
        data,
        isSuccess,
        refetch
    } = useGetUserListQuery()

    const [user, setUser] = useState({
        user: ''
    })

    const {
        data: sucData,
        isLoading: loading,
    } = useInactivateUserQuery(user)

    const handleInactivate = (data) => {
        setUser({
            user: data
        })
    }

    useEffect(() =>{
        if(isSuccess){
            setUser({
                user: ''
            })
        }
        refetch()
    }, [loading])

    return(
        <main className="admin-page">
            <section className="admin-page-head">
                <div>
                    <span className="eyebrow">Admin workspace</span>
                    <h1>Manage users</h1>
                    <p>Review user accounts and restrict access when needed.</p>
                </div>
            </section>
            <section className="admin-panel">
            {
                isSuccess && 
                <AdminUserTable
                    props={data}
                    deletion={handleInactivate}
                />
            }
            </section>
        </main>
    )
}
