import { NavLink, useLocation, useNavigate } from 'react-router-dom'

function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const isAuthenticated = Boolean(localStorage.getItem('token'))

  const logout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <nav>
      <NavLink className="brand-link" to="/dashboard">
        Splitwise Clone
      </NavLink>
      <div className="nav-actions" key={location.pathname}>
        {isAuthenticated ? (
          <>
            <NavLink to="/dashboard">Dashboard</NavLink>
            <button className="text-button" type="button" onClick={logout}>
              Log out
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login">Login</NavLink>
            <NavLink to="/register">Register</NavLink>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar
