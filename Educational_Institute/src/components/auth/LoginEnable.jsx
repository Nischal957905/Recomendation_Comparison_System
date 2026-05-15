import { Outlet, Navigate, useLocation } from "react-router-dom";

const LoginEnable = () => {

    const role = localStorage.getItem('login')
    const accessToken = localStorage.getItem('accessToken')
    const location = useLocation()

    return (
        !(role && accessToken) ? <Outlet/> : <Navigate to="/institution" state={{from: location}} replace/>
    )
}

export default LoginEnable
