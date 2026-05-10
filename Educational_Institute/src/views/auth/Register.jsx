import { useEffect, useState } from "react"
import { usePostRegisterQuery } from "../../auth/authSlice"
import { useNavigate } from "react-router-dom"

 
export default function Register(){

    const [formData, setFormData] = useState({
        location: false
    })
    const [delayedData, setDelayedData] = useState({})

    const navigate = useNavigate()

    const {
        data,
        isSuccess
    } = usePostRegisterQuery(delayedData)

    useEffect(() => {
        if(data && isSuccess){
            localStorage.setItem('username', data.username)
            localStorage.setItem('login',true)
            localStorage.setItem('role', "non-admin")
            navigate('/')
        }
    },[data])
 
    const handleFormDataChange = (event) => {
        const {name, value} = event.target
        setFormData((prevVal) => {
            return{
                ...prevVal,
                [name] : value
            }
        })
    }

    const locationFinder = () => {
        navigator.geolocation.getCurrentPosition((position) => {
            const {latitude, longitude} = position.coords;
            setFormData((prevVal) => {
                return {
                    ...prevVal,
                    'longitude': longitude,
                    'latitude' : latitude
                }
            })
        })
    }

    useEffect(() => {
        if(formData.location){
            if(!formData.latitude || formData.latitude === '')
            locationFinder()
        }
    },[formData.location])

    const handleSubmit = (event) => {
        event.preventDefault()
        if(formData.location === true){
            setDelayedData(formData)
        }
    }

    const handleLocationConfirm = (event) => {
        const {checked,name} = event.target
        setFormData((prevVal) => {
            return {
                ...prevVal,
                [name] : checked
            }
        })
    }


    return (
        <main className="auth-page">
            <section className="auth-panel">
                <span className="eyebrow">Create account</span>
                <h1>Save your location preferences and contribute useful institution reviews.</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Username</label>
                    <input 
                        name="username"
                        type="text"
                        required
                        value={formData.username}
                        onChange={handleFormDataChange}
                    />
                </div>
                <div>
                    <label>Password</label>
                    <input 
                        name="password"
                        type="password"
                        required
                        value={formData.password}
                        onChange={handleFormDataChange}
                    />
                </div>
                <div>
                    <label>Email</label>
                    <input 
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleFormDataChange}
                    />
                </div>
                <div>
                    <label>Location</label>
                    <input 
                        name="location"
                        type="checkbox"
                        required
                        checked={formData.location}
                        onChange={handleLocationConfirm}
                    />
                </div>
                <button>Register</button>
            </form>
            </section>
        </main>
    )
}
