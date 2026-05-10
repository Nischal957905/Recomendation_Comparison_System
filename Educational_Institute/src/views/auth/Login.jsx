import { useEffect, useState } from "react"
import { usePostLoginQuery } from "../../auth/authSlice"
import { useNavigate, useLocation, Link } from 'react-router-dom'
import useAuthentication from "../../components/hooks/useAuthentication"

export default function Login(){

    const {setValueForAuth, valueForAuth} = useAuthentication()
    const navigate = useNavigate()
    const location = useLocation()
    const from = location.state?.from?.pathname || "/"

    const [formData, setFormData] = useState({
        username: '',
        password: '',
    })

    const [delayedValue, setDelayedValue] = useState()
    const [dataError, setDataError] = useState()

    const {
        data,
        isLoading,
        isSuccess,
        isError,
        error
    } = usePostLoginQuery(delayedValue)

    useEffect(() => {
        if (isSuccess) {
            const token = data?.tokenForAccess;
            const userVerify = data?.userVerify;
            const username = data?.user?.username;
            const roles = data?.roles?.role_name;
            if(data.userVerify){
                localStorage.clear()
                localStorage.setItem('username', username);
                localStorage.setItem('login',true)
                localStorage.setItem('role', roles)
                setValueForAuth({'username': username,'login':true,})
                setFormData({
                    username: '',
                    password: '',
                })
                navigate(from, {replace: true})
            }
        }
    }, [data]);

    const handleSubmit = (event) => {
        event.preventDefault()
        setDelayedValue(formData)
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
            <section className="auth-panel">
                <span className="eyebrow">Welcome back</span>
                <h1>Log in to continue comparing and reviewing institutions.</h1>
            <form onSubmit= {handleSubmit} >
                    <div className="login-username">
                        <label>Username:</label>
                        <input 
                            type="text" 
                            name="username"
                            value={formData.username}
                            onChange={handleLoginValueChange}
                        />
                    </div>
                    <div className="login-password">
                        <label>Password</label>
                        <input 
                            type="password" 
                            name="password"
                            value={formData.password}
                            onChange={handleLoginValueChange}
                        />
                    </div>
                <button>Login</button>
            </form>
            </section>
        </main>
    )
}
