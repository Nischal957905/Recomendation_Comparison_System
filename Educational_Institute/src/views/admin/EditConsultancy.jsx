import { useEffect, useState } from "react"
import { useEditPostInstitutionQuery} from "../../app/api/adminSlice"
import { useParams } from "react-router-dom"

export default function EditConsultancy(){

    const [delayedData, setDelayedValue] = useState()
    const { institution } = useParams()

    const [postData, setPostData] = useState({})

    const {
        data,
        isSuccess
    } = useEditPostInstitutionQuery({institution,delayedData})

    const handleChangePostData = (event) => {
        const {value, name} = event.target
        setPostData((prevVal) => {
            return {
                ...prevVal,
                [name] : value
            }
        })
    }
    useEffect(() => {
        if(isSuccess){
            setPostData({
                name: data.name,
                address: data.address,
                platform: data.platform,
                latitude: data.latitude,
                longitude: data.longitude,
                experience: data.experience,
                phone: data.phone,
                email: data.email,
                website: data.website,
                success: data.success,
                university: data.universities,
                edit: true,
                id: data._id,
                online: data.online === true ? "Online" : "Offline"
            })
        }
    },[data])

    const handlePostSubmit = (event) => {
        event.preventDefault()
        setDelayedValue(postData)
    }

    return (
        <main className="admin-page">
            <section className="admin-page-head">
                <div>
                    <span className="eyebrow">Admin workspace</span>
                    <h1>Edit consultancy</h1>
                    <p>Update consultancy service reach, performance, contact, and platform details.</p>
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
                        <label>Platform</label>
                        <input
                            type="text"
                            name="platform"
                            value={postData.platform}
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
                        <label>Success</label>
                        <input
                            type="number"
                            name="success"
                            value={postData.success}
                            onChange={handleChangePostData}
                            required
                        />
                    </div>
                    <div>
                        <label>University</label>
                        <input
                            type="number"
                            name="university"
                            value={postData.university}
                            onChange={handleChangePostData}
                            required
                        />
                    </div>
                    <div>
                        <label>Online</label>
                        <select name="online" value={postData.online} onChange={handleChangePostData}>
                            <option value="Online">Online</option>
                            <option value="Offline">Offline</option>
                        </select>
                    </div>
                    <button>Update</button>
                </form>
            </section>
        </main>
    )
}
