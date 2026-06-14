import { useState } from 'react'
import ChatBox from './ChatBox'

const formatAmount = (amount) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount)

function ExpenseCard({ expense }) {
  const [showChat, setShowChat] = useState(false)

  return (
    <article className="expense-card">
      <div className="expense-summary">
        <div>
          <h3>{expense.description}</h3>
          <p>{expense.splitType.toLowerCase()} split</p>
        </div>
        <strong>{formatAmount(expense.amount)}</strong>
      </div>
      <button
        className="text-button"
        type="button"
        onClick={() => setShowChat((current) => !current)}
      >
        {showChat ? 'Hide comments' : 'Open comments'}
      </button>
      {showChat && <ChatBox expenseId={expense.id} />}
    </article>
  )
}

export default ExpenseCard
