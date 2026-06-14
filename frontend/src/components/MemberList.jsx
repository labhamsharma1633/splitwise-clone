import { useState } from 'react'

function MemberList({ members, onAdd, onRemove, isUpdating, error }) {
  const [userId, setUserId] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    const didAdd = await onAdd(Number(userId))

    if (didAdd) setUserId('')
  }

  return (
    <section className="panel">
      <div className="section-heading">
        <div>
          <h2>Members</h2>
          <p>{members.length} people in this group</p>
        </div>
      </div>

      <form className="inline-form" onSubmit={handleSubmit}>
        <input
          aria-label="User ID"
          type="number"
          min="1"
          placeholder="User ID"
          value={userId}
          onChange={(event) => setUserId(event.target.value)}
          required
        />
        <button className="primary-button" type="submit" disabled={isUpdating}>
          Add member
        </button>
      </form>

      {error && <p className="form-error">{error}</p>}

      <div className="member-list">
        {members.map((member) => (
          <div className="member-row" key={member.user.id}>
            <div>
              <strong>{member.user.name}</strong>
              <span>{member.user.email}</span>
            </div>
            <button
              className="text-button danger-text"
              type="button"
              onClick={() => onRemove(member.user.id)}
              disabled={isUpdating}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </section>
  )
}

export default MemberList
