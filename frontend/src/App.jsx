import { Navigate, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import Dashboard from './pages/Dashboard'
import GroupDetails from './pages/GroupDetails'
import Login from './pages/Login'
import Register from './pages/Register'

function App() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/groups/:groupId" element={<GroupDetails />} />
          </Route>
        </Routes>
      </main>
    </>
  )
}

export default App
