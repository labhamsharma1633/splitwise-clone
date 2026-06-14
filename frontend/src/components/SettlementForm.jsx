import { useState } from 'react'

function SettlementForm({ members, onSubmit, isSubmitting, error }) {
  const [receiverId, setReceiverId] = useState('')
  const [amount, setAmount] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    const didCreate = await onSubmit({
      receiverId: Number(receiverId),
      amount: Number(amount),
    })

    if (didCreate) {
      setReceiverId('')
      setAmount('')
    }
  }

  return (
    <section className="panel">
      <div className="section-heading">
        <div>
          <h2>Record settlement</h2>
          <p>Record a payment you made to another member.</p>
        </div>
      </div>
      <form className="stack-form" onSubmit={handleSubmit}>
        <label htmlFor="receiver">Paid to</label>
        <select
          id="receiver"
          value={receiverId}
          onChange={(event) => setReceiverId(event.target.value)}
          required
        >
          <option value="">Choose a member</option>
          {members.map((member) => (
            <option key={member.user.id} value={member.user.id}>
              {member.user.name}
            </option>
          ))}
        </select>

        <label htmlFor="settlement-amount">Amount</label>
        <input
          id="settlement-amount"
          type="number"
          min="0.01"
          step="0.01"
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          required
        />

        {error && <p className="form-error">{error}</p>}
        <button className="primary-button" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Recording...' : 'Record settlement'}
        </button>
      </form>
    </section>
  )
}

export default SettlementForm
