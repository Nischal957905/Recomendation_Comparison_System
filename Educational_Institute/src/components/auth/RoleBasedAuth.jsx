import { Outlet, Navigate, useLocation } from "react-router-dom";

const RoleBasedAuth = () => {

    const role = localStorage.getItem('role')
    const accessToken = localStorage.getItem('accessToken')
    const location = useLocation()

    return (
        role === 'admin' && accessToken
            ?  <Outlet/>  : <Navigate to="/auth/login" state={{from: location}} replace/>
    )
}

export default RoleBasedAuth
