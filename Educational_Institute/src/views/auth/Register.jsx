import { useEffect, useState } from "react"
import { useLazyPostRegisterQuery } from "../../auth/authSlice"
import { Link, useNavigate } from "react-router-dom"
import MessageProp from "../../components/utilities/MessageProp"

 
export default function Register(){

    const [formData, setFormData] = useState({
        location: false
    })
    const [messagePop, setMessagePop] = useState(false)
    const [display, setDisplay] = useState({
        message: '',
        severity: 'info',
    })

    const navigate = useNavigate()

    const [triggerRegister, {
        data,
        isLoading,
        isSuccess,
        isError,
    }] = useLazyPostRegisterQuery()

    const showMessage = (message, severity) => {
        setDisplay({ message, severity })
        setMessagePop(true)
    }

    const destroyPopMessage = (event, reason) => {
        if(reason === 'clickaway'){
            return
        }
        setMessagePop(false)
    }

    useEffect(() => {
        let redirectTimer
        if(data && isSuccess){
            localStorage.setItem('username', data.username)
            localStorage.setItem('login',true)
            localStorage.setItem('role', "non-admin")
            showMessage('Account created successfully. Redirecting...', 'success')
            redirectTimer = setTimeout(() => navigate('/'), 800)
        }
        return () => {
            if (redirectTimer) {
                clearTimeout(redirectTimer)
            }
        }
    },[data, isSuccess, navigate])

    useEffect(() => {
        if(isError){
            showMessage('Registration failed. The username may already exist or the server rejected the request.', 'error')
        }
    }, [isError])
 
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
        if(!navigator.geolocation){
            showMessage('Location is not supported by this browser.', 'error')
            return
        }
        navigator.geolocation.getCurrentPosition((position) => {
            const {latitude, longitude} = position.coords;
            setFormData((prevVal) => {
                return {
                    ...prevVal,
                    'longitude': longitude,
                    'latitude' : latitude
                }
            })
            showMessage('Location permission granted.', 'success')
        }, () => {
            setFormData((prevVal) => ({
                ...prevVal,
                location: false
            }))
            showMessage('Location permission is required to create an account.', 'error')
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
        const username = formData.username?.trim()
        const email = formData.email?.trim()
        if(!username || !formData.password || !email){
            showMessage('Fill in username, email, and password.', 'warning')
            return
        }
        if(formData.password.length < 6){
            showMessage('Password must be at least 6 characters.', 'warning')
            return
        }
        if(formData.location !== true){
            showMessage('Allow location access before registering.', 'warning')
            return
        }
        if(!formData.latitude || !formData.longitude){
            showMessage('Waiting for location permission. Try again after allowing location access.', 'warning')
            locationFinder()
            return
        }
        triggerRegister({
            ...formData,
            username,
            email
        })
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
            <MessageProp
                stateValue={messagePop}
                destroy={destroyPopMessage}
                messageType={display.severity}
                message={display.message}
            />
            <section className="auth-panel">
                <span className="eyebrow">Create account</span>
                <h1>Sign up</h1>
                <p>Create an account to save preferences and use distance-aware recommendations.</p>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Username</label>
                    <input 
                        name="username"
                        type="text"
                        required
                        value={formData.username || ''}
                        onChange={handleFormDataChange}
                        placeholder="Choose a username"
                        autoComplete="username"
                    />
                </div>
                <div>
                    <label>Password</label>
                    <input 
                        name="password"
                        type="password"
                        required
                        value={formData.password || ''}
                        onChange={handleFormDataChange}
                        placeholder="Create a password"
                        autoComplete="new-password"
                    />
                </div>
                <div>
                    <label>Email</label>
                    <input 
                        name="email"
                        type="email"
                        required
                        value={formData.email || ''}
                        onChange={handleFormDataChange}
                        placeholder="name@example.com"
                        autoComplete="email"
                    />
                </div>
                <div className="auth-checkbox">
                    <input 
                        name="location"
                        type="checkbox"
                        required
                        checked={formData.location}
                        onChange={handleLocationConfirm}
                    />
                    <label>Allow location access for distance-aware recommendations.</label>
                </div>
                <button disabled={isLoading}>{isLoading ? 'Creating account...' : 'Register'}</button>
            </form>
            <p className="auth-switch">Already have an account? <Link to="/auth/login">Login</Link></p>
            </section>
        </main>
    )
}
