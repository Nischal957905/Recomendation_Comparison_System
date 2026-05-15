import { usePostConsultancyNewQuery }  from "../../app/api/adminSlice"

import { useState } from "react"

export default function ConsultancyPost(){

    const [delayedData, setDelayedValue] = useState()

    const [postData, setPostData] = useState({
        name: '',
        online: 'Offline',
    })

    const {
        data
    } = usePostConsultancyNewQuery(delayedData)

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
        setDelayedValue(postData)
    }

    return (
        <main className="admin-page">
            <section className="admin-page-head">
                <div>
                    <span className="eyebrow">Admin workspace</span>
                    <h1>Create consultancy</h1>
                    <p>Add a new consultancy listing with service reach, performance, schedule, and contact details.</p>
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
                        <label>Specialization</label>
                        <input
                            type="text"
                            name="specialization"
                            value={postData.specialization}
                            onChange={handleChangePostData}
                            required
                        />
                    </div>
                    <div>
                        <label>Country</label>
                        <input
                            type="text"
                            name="country"
                            value={postData.country}
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
                        <label>Holidays</label>
                        <input
                            type="text"
                            name="holidays"
                            value={postData.holidays}
                            onChange={handleChangePostData}
                            required
                        />
                    </div>
                    <div>
                        <label>Opening Time</label>
                        <input
                            type="time"
                            name="opening"
                            value={postData.opening}
                            onChange={handleChangePostData}
                            required
                        />
                    </div>
                    <div>
                        <label>Closing Time</label>
                        <input
                            type="time"
                            name="closing"
                            value={postData.closing}
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
                    <button>Post Data</button>
                </form>
            </section>
        </main>
    )
}
