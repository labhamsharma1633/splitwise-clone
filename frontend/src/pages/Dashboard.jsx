import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import GroupCard from '../components/GroupCard'
import api, { getApiError } from '../services/api'

function Dashboard() {
  const navigate = useNavigate()
  const fileInputRef = useRef(null)
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
  const [isImporting, setIsImporting] = useState(false)
  const [importError, setImportError] = useState('')
  const [importResult, setImportResult] = useState(null)

  const fetchGroups = useCallback(async () => {
    setIsLoading(true)
    setError('')

    try {
      const response = await api.get('/api/groups')
      setGroups(response.data.groups)
    } catch (requestError) {
      setError(getApiError(requestError, 'Could not load your groups.'))
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handleImportClick = () => {
    setImportError('')
    setImportResult(null)
    fileInputRef.current?.click()
  }

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      setImportError('Please select a valid CSV file.')
      event.target.value = ''
      return
    }

    setImportError('')
    setImportResult(null)
    setIsImporting(true)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await api.post('/api/import/csv', formData)

      const { importedRows, anomalies, reports } = response.data
      setImportResult({ importedRows, anomalies, reports })
      await fetchGroups()
    } catch (requestError) {
      setImportError(getApiError(requestError, 'Could not import CSV file.'))
    } finally {
      setIsImporting(false)
      event.target.value = ''
    }
  }

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
      await api.post('/api/groups', formData)
      setIsModalOpen(false)
      setFormData({ name: '', description: '' })
      await fetchGroups()
    } catch (requestError) {
      setCreateError(
        getApiError(requestError, 'Could not create the group.'),
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
        <div className="nav-actions">
          <button
            className="secondary-button"
            type="button"
            onClick={handleImportClick}
            disabled={isImporting}
          >
            {isImporting ? 'Importing...' : 'Import CSV'}
          </button>
          <button
            className="primary-button"
            type="button"
            onClick={() => setIsModalOpen(true)}
          >
            Create Group
          </button>
        </div>
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

      {importError && (
        <div className="page-error" role="alert">
          <p>{importError}</p>
        </div>
      )}

      {importResult && (
        <section className="panel">
          <div className="section-heading">
            <div>
              <h2>Import summary</h2>
              <p>CSV import completed successfully.</p>
            </div>
          </div>
          <div className="helper-text">
            <p>Imported rows: {importResult.importedRows}</p>
            <p>Anomalies: {importResult.anomalies}</p>
          </div>
          {importResult.reports && importResult.reports.length > 0 && (
            <table>
              <thead>
                <tr>
                  <th>Row Number</th>
                  <th>Issue</th>
                  <th>Action</th>
                  <th>Severity</th>
                </tr>
              </thead>
              <tbody>
                {importResult.reports.map((report) => (
                  <tr key={`${report.rowNumber}-${report.issue}`}>
                    <td>{report.rowNumber}</td>
                    <td>{report.issue}</td>
                    <td>{report.action}</td>
                    <td>{report.severity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      )}

      {!isLoading && !error && groups.length > 0 && (
        <div className="group-grid">
          {groups.map((group) => (
            <GroupCard
              group={group}
              key={group.id}
              onClick={() => navigate(`/groups/${group.id}`)}
            />
          ))}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

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
