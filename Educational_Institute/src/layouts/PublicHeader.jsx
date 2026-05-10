import { Link, useNavigate} from "react-router-dom"

export default function PublicHeader() {

    const value = localStorage.getItem('login')
    const navigate = useNavigate()
    const logout = () => {
        localStorage.clear()
        navigate('/auth/login')
    }

    return (
        <>
            <header className="header-user">
                <Link className="logo-con" to="/">
                    Consult Me
                </Link>
                <nav className="menu-holder" aria-label="Primary navigation">
                    <Link className="home-menu" to="/">Home</Link>
                    <Link className="list-menu" to="/institution">Listings</Link>
                    <Link to="/college">Colleges</Link>
                    <Link to="/school">Schools</Link>
                    <Link className="compare-menu" to="/comparison">Comparison</Link>
                </nav>
                {
                    value ?  <button className="btn-signup" onClick={logout}>Logout</button>
                    :<button className="btn-signup" onClick={() => navigate('/auth/register')}>Sign up</button>

                }
            </header>
        </>
    )
}
