import { useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'

function Login() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target

    setFormData((currentFormData) => ({
      ...currentFormData,
      [name]: value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      const response = await axios.post(
        'http://localhost:5000/api/auth/login',
        formData,
      )

      localStorage.setItem('token', response.data.token)
      navigate('/dashboard')
    } catch (requestError) {
      const message = axios.isAxiosError(requestError)
        ? requestError.response?.data?.message
        : null

      setError(message || 'Login failed. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="auth-page">
      <div className="auth-card">
        <div className="auth-heading">
          <p className="auth-eyebrow">Splitwise Clone</p>
          <h1>Welcome back</h1>
          <p>Log in to manage your shared expenses.</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            autoComplete="email"
            required
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            autoComplete="current-password"
            required
          />

          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Logging in...' : 'Log in'}
          </button>
        </form>

        <p className="auth-footer">
          New to Splitwise Clone? <Link to="/register">Create an account</Link>
        </p>
      </div>
    </section>
  )
}

export default Login
