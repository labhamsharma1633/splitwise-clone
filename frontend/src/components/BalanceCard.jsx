const formatAmount = (amount) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(amount)

function BalanceCard({ userId, amount, name }) {
  const status = amount > 0 ? 'gets back' : amount < 0 ? 'owes' : 'is settled'

  return (
    <div className="balance-card">
      <div>
        <strong>{name || `User ${userId}`}</strong>
        <span>{status}</span>
      </div>
      <strong
        className={
          amount > 0 ? 'positive-text' : amount < 0 ? 'danger-text' : ''
        }
      >
        {formatAmount(Math.abs(amount))}
      </strong>
    </div>
  )
}

export default BalanceCard
