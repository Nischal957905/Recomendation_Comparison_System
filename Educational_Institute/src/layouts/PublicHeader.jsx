import { NavLink, useNavigate } from "react-router-dom"

export default function PublicHeader() {

    const value = localStorage.getItem('login')
    const navigate = useNavigate()
    const logout = () => {
        localStorage.clear()
        navigate('/auth/login')
    }

    return (
        <header className="header-user">
            <NavLink to="/" className="logo-con" aria-label="Go to homepage">
                <img src='/logo.png' alt="Recommendation and comparison system logo" />
            </NavLink>
            <nav className="menu-holder" aria-label="Primary navigation">
                <NavLink to="/" end className={({ isActive }) => isActive ? 'menu-link menu-link-active' : 'menu-link'}>Home</NavLink>
                <NavLink to="/institution" className={({ isActive }) => isActive ? 'menu-link menu-link-active' : 'menu-link'}>Listings</NavLink>
                <NavLink to="/comparison" className={({ isActive }) => isActive ? 'menu-link menu-link-active' : 'menu-link'}>Comparison</NavLink>
                <NavLink to="/discussion" className={({ isActive }) => isActive ? 'menu-link menu-link-active' : 'menu-link'}>Discussion</NavLink>
            </nav>
            <div></div>
            {
                value ? <button className="btn-signup" onClick={logout}>Logout</button>
                : <button className="btn-signup" onClick={() => navigate('/auth/register')}>Sign up</button>
            }
        </header>
    )
}
