import { useState, useEffect } from "react"
import { useEditPostCollegeQuery } from "../../app/api/adminSlice"
import { useParams } from "react-router-dom"


export default function EditCollege(){


    const {institution} = useParams()
    const [postData, setPostData] = useState({})

    const [delayedData, setDelayedData] = useState({})

    const {
        data,
        isSuccess
    } = useEditPostCollegeQuery({institution, delayedData})


    const handleChangePostData = (event) => {
        const {value, name} = event.target
        setPostData((prevVal) => {
            return {
                ...prevVal,
                [name] : value
            }
        })
    }

    const handlePostSubmit = (event) => {
        event.preventDefault()
        setDelayedData(postData)
    }

    useEffect(() => {
        if(isSuccess){
            setPostData({
                name: data.name,
                address: data.location,
                latitude: data.latitude,
                longitude: data.longitude,
                experience: data.experience,
                phone: data.phone,
                email: data.email,
                website: data.website_url,
                success: data.success,
                edit: true,
                id: data._id,
                ownership: data.ownership === " community Institution " ? "Public" : "Private",
                accreditation: data.ugc === " ✓ UGC Accredited" ? "Ugc" : "None"
            })
        }
    },[data])

    return (
        <main className="admin-page">
            <section className="admin-page-head">
                <div>
                    <span className="eyebrow">Admin workspace</span>
                    <h1>Edit college</h1>
                    <p>Update college profile, location, contact, and ownership information.</p>
                </div>
            </section>
            <section className="admin-panel">
                <form className="admin-form" onSubmit={handlePostSubmit}>
                    <div>
                        <label>Name</label>
                        <input
                            type="text"
                            name="name"
                            value={postData.name}
                            onChange={handleChangePostData}
                            required
                        />
                    </div>
                    <div>
                        <label>Address</label>
                        <input
                            type="text"
                            name="address"
                            value={postData.address}
                            onChange={handleChangePostData}
                            required
                        />
                    </div>
                    <div>
                        <label>Latitude</label>
                        <input
                            type="number"
                            name="latitude"
                            value={postData.latitude}
                            onChange={handleChangePostData}
                            required
                        />
                    </div>
                    <div>
                        <label>Longitude</label>
                        <input
                            type="number"
                            name="longitude"
                            value={postData.longitude}
                            onChange={handleChangePostData}
                            required
                        />
                    </div>
                    <div>
                        <label>Experience</label>
                        <input
                            type="number"
                            name="experience"
                            value={postData.experience}
                            onChange={handleChangePostData}
                            required
                        />
                    </div>
                    <div>
                        <label>phone</label>
                        <input
                            type="text"
                            name="phone"
                            value={postData.phone}
                            onChange={handleChangePostData}
                            required
                        />
                    </div>
                    <div>
                        <label>email</label>
                        <input
                            type="email"
                            name="email"
                            value={postData.email}
                            onChange={handleChangePostData}
                            required
                        />
                    </div>
                    <div>
                        <label>Website</label>
                        <input
                            type="text"
                            name="website"
                            value={postData.website}
                            onChange={handleChangePostData}
                            required
                        />
                    </div>
                    <div>
                        <label>Accreditation</label>
                        <select name="accreditation" value={postData.accreditation} onChange={handleChangePostData}>
                            <option value="Ugc">Ugc</option>
                            <option value="None">None</option>
                        </select>
                    </div>
                    <div>
                        <label>Ownership</label>
                        <select name="ownership" value={postData.ownership} onChange={handleChangePostData}>
                            <option value="Private">Private</option>
                            <option value="Public">Public</option>
                        </select>
                    </div>
                    <button>Post Data</button>
                </form>
            </section>
        </main>
    )
}
