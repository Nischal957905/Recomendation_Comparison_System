import { useEffect, useState } from "react"
import { FiMoon, FiSun } from "react-icons/fi"
import { Link, NavLink, useNavigate} from "react-router-dom"

export default function PublicHeader() {

    const [theme, setTheme] = useState(() => {
        return localStorage.getItem('theme') || document.documentElement.dataset.theme || 'light'
    })
    const value = localStorage.getItem('login') && localStorage.getItem('accessToken')
    const role = localStorage.getItem('role')
    const isAdmin = Boolean(value) && role === 'admin'
    const navigate = useNavigate()

    useEffect(() => {
        document.documentElement.dataset.theme = theme
        localStorage.setItem('theme', theme)
    }, [theme])

    const toggleTheme = () => {
        setTheme((currentTheme) => currentTheme === 'dark' ? 'light' : 'dark')
    }

    const logout = () => {
        localStorage.removeItem('username')
        localStorage.removeItem('login')
        localStorage.removeItem('role')
        localStorage.removeItem('accessToken')
        navigate('/auth/login')
    }

    return (
        <>
            <header className="header-user">
                <Link className="logo-con" to="/">
                    Consult Me
                </Link>
                <nav className="menu-holder" aria-label="Primary navigation">
                    <NavLink to="/" end>Home</NavLink>
                    <NavLink to="/institution">Listings</NavLink>
                    <NavLink to="/college">Colleges</NavLink>
                    <NavLink to="/school">Schools</NavLink>
                    <NavLink to="/comparison">Comparison</NavLink>
                    {isAdmin && (
                        <div className="admin-nav-group">
                            <NavLink to="/admin">Admin</NavLink>
                            <div className="admin-nav-menu">
                                <NavLink to="/admin/new/consultancy">New consultancy</NavLink>
                                <NavLink to="/admin/new/college">New college</NavLink>
                                <NavLink to="/admin/new/school">New school</NavLink>
                                <NavLink to="/admin/user">Users</NavLink>
                            </div>
                        </div>
                    )}
                </nav>
                <div className="header-actions">
                    <button
                        className="theme-toggle"
                        type="button"
                        onClick={toggleTheme}
                        aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                        title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
                    >
                        {theme === 'dark' ? <FiSun/> : <FiMoon/>}
                    </button>
                    {
                        value ?  <button className="btn-signup" onClick={logout}>Logout</button>
                        :<button className="btn-signup" onClick={() => navigate('/auth/register')}>Sign up</button>

                    }
                </div>
            </header>
        </>
    )
}
