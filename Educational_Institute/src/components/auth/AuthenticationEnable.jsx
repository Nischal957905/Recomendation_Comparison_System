import useAuthentication from "../hooks/useAuthentication";
import { Outlet, Navigate, useLocation } from "react-router-dom";

const AuthenticationEnable = () => {

    const { valueForAuth } = useAuthentication()
    const location = useLocation()
    const accessToken = localStorage.getItem('accessToken')

    return (
        valueForAuth?.username && accessToken
            ?   <Outlet/>
            : <Navigate to="/auth/login" state={{from: location}} replace/>
    )
}

export default AuthenticationEnable
