import { useCallback, useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const GROUPS_URL = 'http://localhost:5000/api/groups'

const getAuthConfig = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  },
})

const getErrorMessage = (requestError, fallback) =>
  axios.isAxiosError(requestError)
    ? requestError.response?.data?.message || fallback
    : fallback

function Dashboard() {
  const navigate = useNavigate()
  const [groups, setGroups] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [createError, setCreateError] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  })

  const fetchGroups = useCallback(async () => {
    setIsLoading(true)
    setError('')

    try {
      const response = await axios.get(GROUPS_URL, getAuthConfig())
      setGroups(response.data.groups)
    } catch (requestError) {
      setError(getErrorMessage(requestError, 'Could not load your groups.'))
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchGroups()
  }, [fetchGroups])

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((currentFormData) => ({
      ...currentFormData,
      [name]: value,
    }))
  }

  const closeModal = () => {
    if (isCreating) return

    setIsModalOpen(false)
    setCreateError('')
    setFormData({ name: '', description: '' })
  }

  const handleCreateGroup = async (event) => {
    event.preventDefault()
    setCreateError('')
    setIsCreating(true)

    try {
      await axios.post(GROUPS_URL, formData, getAuthConfig())
      setIsModalOpen(false)
      setFormData({ name: '', description: '' })
      await fetchGroups()
    } catch (requestError) {
      setCreateError(
        getErrorMessage(requestError, 'Could not create the group.'),
      )
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <section className="dashboard-page">
      <div className="dashboard-header">
        <div>
          <p className="auth-eyebrow">Your space</p>
          <h1>Groups</h1>
          <p>Manage shared expenses with friends and family.</p>
        </div>
        <button
          className="primary-button"
          type="button"
          onClick={() => setIsModalOpen(true)}
        >
          Create Group
        </button>
      </div>

      {isLoading && <p className="status-message">Loading groups...</p>}

      {!isLoading && error && (
        <div className="page-error" role="alert">
          <p>{error}</p>
          <button type="button" onClick={fetchGroups}>
            Try again
          </button>
        </div>
      )}

      {!isLoading && !error && groups.length === 0 && (
        <div className="empty-state">
          <h2>No groups yet</h2>
          <p>Create your first group to start tracking shared expenses.</p>
        </div>
      )}

      {!isLoading && !error && groups.length > 0 && (
        <div className="group-grid">
          {groups.map((group) => (
            <button
              className="group-card"
              key={group.id}
              type="button"
              onClick={() => navigate(`/groups/${group.id}`)}
            >
              <h2>{group.name}</h2>
              <p>{group.description || 'No description'}</p>
            </button>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="modal-backdrop" onMouseDown={closeModal}>
          <div
            aria-labelledby="create-group-title"
            aria-modal="true"
            className="modal-card"
            role="dialog"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="modal-heading">
              <div>
                <h2 id="create-group-title">Create a group</h2>
                <p>Add a name and an optional description.</p>
              </div>
              <button
                aria-label="Close modal"
                className="icon-button"
                type="button"
                onClick={closeModal}
              >
                &times;
              </button>
            </div>

            <form className="auth-form" onSubmit={handleCreateGroup}>
              <label htmlFor="group-name">Group name</label>
              <input
                id="group-name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                autoFocus
                required
              />

              <label htmlFor="group-description">Description</label>
              <textarea
                id="group-description"
                name="description"
                rows="3"
                value={formData.description}
                onChange={handleChange}
              />

              {createError && (
                <p className="form-error" role="alert">
                  {createError}
                </p>
              )}

              <div className="modal-actions">
                <button
                  className="secondary-button"
                  type="button"
                  onClick={closeModal}
                  disabled={isCreating}
                >
                  Cancel
                </button>
                <button
                  className="primary-button"
                  type="submit"
                  disabled={isCreating}
                >
                  {isCreating ? 'Creating...' : 'Create Group'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  )
}

export default Dashboard
