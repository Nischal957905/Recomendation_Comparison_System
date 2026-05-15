import PostsTable from "../../../components/utilities/PostsTable"
import { useEditPostUserQuery } from '../../../app/api/adminSlice'
import { useParams } from "react-router-dom";
import { useState } from "react";

export default function UserPost(){


    const {institution} = useParams()
    const [delayedData, setDelayedData] = useState()

    const {
        data,
        isSuccess
    } = useEditPostUserQuery({institution,delayedData})

    return (
        <main className="admin-page">
            <section className="admin-page-head">
                <div>
                    <span className="eyebrow">Admin workspace</span>
                    <h1>User posts</h1>
                    <p>Review posts submitted by this user.</p>
                </div>
            </section>
            <section className="admin-panel">
            {
                isSuccess &&
                <PostsTable
                    props={data}
                />
            }
            </section>
        </main>
    )

}
