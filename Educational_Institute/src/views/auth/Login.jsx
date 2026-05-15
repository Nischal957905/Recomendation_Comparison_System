import { useEffect, useState } from "react"
import { useLazyPostLoginQuery } from "../../auth/authSlice"
import { useNavigate, useLocation, Link } from 'react-router-dom'
import useAuthentication from "../../components/hooks/useAuthentication"
import MessageProp from "../../components/utilities/MessageProp"

export default function Login(){

    const {setValueForAuth} = useAuthentication()
    const navigate = useNavigate()
    const location = useLocation()
    const from = location.state?.from?.pathname || "/"

    const [formData, setFormData] = useState({
        username: '',
        password: '',
    })

    const [messagePop, setMessagePop] = useState(false)
    const [display, setDisplay] = useState({
        message: '',
        severity: 'info',
    })

    const [triggerLogin, {
        data,
        isLoading,
        isSuccess,
        isError,
        error
    }] = useLazyPostLoginQuery()

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
        if (isSuccess) {
            const token = data?.tokenForAccess;
            const username = data?.user?.username;
            const roles = data?.roles?.role_name;
            if(data.userVerify){
                localStorage.clear()
                localStorage.setItem('username', username);
                localStorage.setItem('login',true)
                localStorage.setItem('role', roles)
                localStorage.setItem('accessToken', token)
                setValueForAuth({'username': username,'login':true,})
                setFormData({
                    username: '',
                    password: '',
                })
                showMessage('Login successful. Redirecting...', 'success')
                redirectTimer = setTimeout(() => navigate(from, {replace: true}), 700)
            }
            else {
                showMessage('Login failed. Check your username and password.', 'error')
            }
        }
        return () => {
            if (redirectTimer) {
                clearTimeout(redirectTimer)
            }
        }
    }, [data, isSuccess, from, navigate, setValueForAuth]);

    useEffect(() => {
        if(isError){
            const status = error?.status
            const message = status === 401
                ? 'Invalid username or password.'
                : 'Unable to log in right now. Please try again.'
            showMessage(message, 'error')
        }
    }, [isError, error])

    const handleSubmit = (event) => {
        event.preventDefault()
        const username = formData.username.trim()
        if(!username || !formData.password){
            showMessage('Enter both username and password.', 'warning')
            return
        }
        triggerLogin({
            username,
            password: formData.password
        })
    }

    const handleLoginValueChange = (event) => {
        const {value, name} = event.target;
        setFormData(prevVal => {
            return {
                ...prevVal,
                [name]: value,
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
                <span className="eyebrow">Welcome back</span>
                <h1>Login</h1>
                <p>Access your saved comparisons, reviews, and account tools.</p>
            <form onSubmit= {handleSubmit} >
                    <div className="login-username">
                        <label>Username</label>
                        <input 
                            type="text" 
                            name="username"
                            value={formData.username}
                            onChange={handleLoginValueChange}
                            placeholder="Enter your username"
                            autoComplete="username"
                        />
                    </div>
                    <div className="login-password">
                        <label>Password</label>
                        <input 
                            type="password" 
                            name="password"
                            value={formData.password}
                            onChange={handleLoginValueChange}
                            placeholder="Enter your password"
                            autoComplete="current-password"
                        />
                    </div>
                <button disabled={isLoading}>{isLoading ? 'Logging in...' : 'Login'}</button>
            </form>
            <p className="auth-switch">New here? <Link to="/auth/register">Create an account</Link></p>
            </section>
        </main>
    )
}
