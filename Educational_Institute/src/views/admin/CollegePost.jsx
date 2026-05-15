import { useState } from "react"
import { usePostCollegeNewQuery } from "../../app/api/adminSlice"

export default function CollegePost(){

    const [postData, setPostData] = useState({
        name: '',
        accreditation: 'None',
        ownership: 'Public',
    })

    const [delayedValue, setDelayedValue] = useState({

    })

    const {
        data,
    } = usePostCollegeNewQuery(delayedValue)

    

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
                    <h1>Create college</h1>
                    <p>Add a new college listing with contact, location, schedule, and ownership details.</p>
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
                        <label>Established at</label>
                        <input
                            type="date"
                            name="established"
                            value={postData.established}
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
