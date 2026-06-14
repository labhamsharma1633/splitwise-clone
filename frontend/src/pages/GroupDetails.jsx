import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import BalanceCard from '../components/BalanceCard'
import CreateExpenseModal from '../components/CreateExpenseModal'
import ExpenseCard from '../components/ExpenseCard'
import MemberList from '../components/MemberList'
import SettlementForm from '../components/SettlementForm'
import api, { getApiError } from '../services/api'

function GroupDetails() {
  const { groupId } = useParams()
  const numericGroupId = Number(groupId)
  const [group, setGroup] = useState(null)
  const [balances, setBalances] = useState({})
  const [expenses, setExpenses] = useState([])
  const [settlements, setSettlements] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [pageError, setPageError] = useState('')
  const [memberError, setMemberError] = useState('')
  const [isUpdatingMember, setIsUpdatingMember] = useState(false)
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false)
  const [isCreatingExpense, setIsCreatingExpense] = useState(false)
  const [expenseError, setExpenseError] = useState('')
  const [isCreatingSettlement, setIsCreatingSettlement] = useState(false)
  const [settlementError, setSettlementError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const fetchGroup = useCallback(async () => {
    const response = await api.get('/api/groups')
    const requestedGroup = response.data.groups.find(
      (item) => Number(item.id) === numericGroupId,
    )

    if (!requestedGroup) throw new Error('Group not found.')
    setGroup(requestedGroup)
  }, [numericGroupId])

  const fetchBalances = useCallback(async () => {
    const response = await api.get(`/api/groups/${numericGroupId}/balance`)
    setBalances(response.data.balances)
  }, [numericGroupId])

  const loadPage = useCallback(async () => {
    setIsLoading(true)
    setPageError('')

    try {
      await Promise.all([fetchGroup(), fetchBalances()])
    } catch (requestError) {
      setPageError(getApiError(requestError, requestError.message))
    } finally {
      setIsLoading(false)
    }
  }, [fetchBalances, fetchGroup])

  useEffect(() => {
    loadPage()
  }, [loadPage])

  const addMember = async (userId) => {
    setMemberError('')
    setIsUpdatingMember(true)

    try {
      await api.post(`/api/groups/${numericGroupId}/members`, { userId })
      await Promise.all([fetchGroup(), fetchBalances()])
      setSuccessMessage('Member added successfully.')
      return true
    } catch (requestError) {
      setMemberError(getApiError(requestError, 'Could not add member.'))
      return false
    } finally {
      setIsUpdatingMember(false)
    }
  }

  const removeMember = async (userId) => {
    setMemberError('')
    setIsUpdatingMember(true)

    try {
      await api.delete(`/api/groups/${numericGroupId}/members/${userId}`)
      await Promise.all([fetchGroup(), fetchBalances()])
      setSuccessMessage('Member removed successfully.')
    } catch (requestError) {
      setMemberError(getApiError(requestError, 'Could not remove member.'))
    } finally {
      setIsUpdatingMember(false)
    }
  }

  const createExpense = async (expenseData) => {
    setExpenseError('')
    setIsCreatingExpense(true)

    try {
      const response = await api.post('/api/expenses', {
        ...expenseData,
        groupId: numericGroupId,
      })
      setExpenses((current) => [response.data.expense, ...current])
      setIsExpenseModalOpen(false)
      setSuccessMessage('Expense created successfully.')
      await fetchBalances()
    } catch (requestError) {
      setExpenseError(getApiError(requestError, 'Could not create expense.'))
    } finally {
      setIsCreatingExpense(false)
    }
  }

  const createSettlement = async (settlementData) => {
    setSettlementError('')
    setIsCreatingSettlement(true)

    try {
      const response = await api.post('/api/settlements', {
        groupId: numericGroupId,
        ...settlementData,
      })
      setSettlements((current) => [response.data.settlement, ...current])
      setSuccessMessage('Settlement recorded successfully.')
      await Promise.all([fetchBalances(), fetchGroup()])
      return true
    } catch (requestError) {
      setSettlementError(
        getApiError(requestError, 'Could not record settlement.'),
      )
      return false
    } finally {
      setIsCreatingSettlement(false)
    }
  }

  // Clear transient success messages after a short delay
  useEffect(() => {
    if (!successMessage) return undefined

    const id = setTimeout(() => setSuccessMessage(''), 3000)
    return () => clearTimeout(id)
  }, [successMessage])

  if (isLoading) {
    return <p className="status-message page-status">Loading group...</p>
  }

  if (pageError || !group) {
    return (
      <div className="page-error page-status">
        <p>{pageError || 'Group not found.'}</p>
        <button type="button" onClick={loadPage}>
          Try again
        </button>
      </div>
    )
  }

  const namesById = Object.fromEntries(
    group.members.map((member) => [member.user.id, member.user.name]),
  )

  return (
    <section className="group-page">
      <Link className="back-link" to="/dashboard">
        Back to groups
      </Link>

      <div className="dashboard-header group-header">
        <div>
          <p className="auth-eyebrow">Group workspace</p>
          <h1>{group.name}</h1>
          <p>{group.description || 'No description'}</p>
        </div>
        <button
          className="primary-button"
          type="button"
          onClick={() => {
            setExpenseError('')
            setIsExpenseModalOpen(true)
          }}
        >
          Add Expense
        </button>
      </div>

      {successMessage && (
        <p className="success-message" role="status">
          {successMessage}
        </p>
      )}

      <div className="group-layout">
        <div className="main-column">
          <section className="panel">
            <div className="section-heading">
              <div>
                <h2>Balances</h2>
                <p>Current totals after expenses and settlements.</p>
              </div>
            </div>
            <div className="balance-grid">
              {Object.keys(balances).length === 0 && (
                <p className="helper-text">No balances to show yet.</p>
              )}
              {Object.entries(balances).map(([userId, amount]) => (
                <BalanceCard
                  key={userId}
                  userId={userId}
                  amount={amount}
                  name={namesById[userId]}
                />
              ))}
            </div>
          </section>

          <section className="panel">
            <div className="section-heading">
              <div>
                <h2>Expenses</h2>
                <p>Expenses created during this session.</p>
              </div>
            </div>
            <div className="expense-list">
              {expenses.length === 0 && (
                <p className="helper-text">No new expenses this session.</p>
              )}
              {expenses.map((expense) => (
                <ExpenseCard expense={expense} key={expense.id} />
              ))}
            </div>
          </section>

          <section className="panel">
            <div className="section-heading">
              <div>
                <h2>Settlement history</h2>
                <p>Settlements recorded during this session.</p>
              </div>
            </div>
            <div className="settlement-list">
              {settlements.length === 0 && (
                <p className="helper-text">No new settlements this session.</p>
              )}
              {settlements.map((settlement) => (
                <div className="settlement-row" key={settlement.id}>
                  <span>
                    Paid {namesById[settlement.receiverId] || 'member'}
                  </span>
                  <strong>{settlement.amount}</strong>
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className="side-column">
          <MemberList
            members={group.members}
            onAdd={addMember}
            onRemove={removeMember}
            isUpdating={isUpdatingMember}
            error={memberError}
          />
          <SettlementForm
            members={group.members}
            onSubmit={createSettlement}
            isSubmitting={isCreatingSettlement}
            error={settlementError}
          />
        </aside>
      </div>

      {isExpenseModalOpen && (
        <CreateExpenseModal
          members={group.members}
          onClose={() => {
            if (!isCreatingExpense) setIsExpenseModalOpen(false)
          }}
          onSubmit={createExpense}
          isSubmitting={isCreatingExpense}
          apiError={expenseError}
        />
      )}
    </section>
  )
}

export default GroupDetails
