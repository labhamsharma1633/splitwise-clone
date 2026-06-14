import { NavLink } from 'react-router-dom'

function Navbar() {
  return (
    <nav>
      <NavLink to="/dashboard">Splitwise Clone</NavLink>
      <NavLink to="/login">Login</NavLink>
      <NavLink to="/register">Register</NavLink>
    </nav>
  )
}

export default Navbar
