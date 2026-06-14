import { useMemo, useState } from 'react'

const SPLIT_TYPES = ['EQUAL', 'UNEQUAL', 'PERCENTAGE', 'SHARE']

function CreateExpenseModal({
  members,
  onClose,
  onSubmit,
  isSubmitting,
  apiError,
}) {
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [splitType, setSplitType] = useState('EQUAL')
  const [selectedIds, setSelectedIds] = useState(
    members.map((member) => member.user.id),
  )
  const [values, setValues] = useState({})
  const [validationError, setValidationError] = useState('')

  const numericAmount = Number(amount)
  const selectedMembers = useMemo(
    () => members.filter((member) => selectedIds.includes(member.user.id)),
    [members, selectedIds],
  )

  const toggleMember = (userId) => {
    setSelectedIds((current) =>
      current.includes(userId)
        ? current.filter((id) => id !== userId)
        : [...current, userId],
    )
  }

  const updateValue = (userId, value) => {
    setValues((current) => ({ ...current, [userId]: value }))
  }

  const buildPayload = () => {
    if (!description.trim() || numericAmount <= 0) {
      return { error: 'Enter a description and a valid amount.' }
    }

    if (selectedIds.length === 0) {
      return { error: 'Select at least one participant.' }
    }

    if (splitType === 'EQUAL') {
      return {
        payload: {
          description,
          amount: numericAmount,
          splitType,
          participants: selectedIds,
        },
      }
    }

    const field =
      splitType === 'UNEQUAL'
        ? 'amount'
        : splitType === 'PERCENTAGE'
          ? 'percentage'
          : 'shares'
    const splits = selectedIds.map((userId) => ({
      userId,
      [field]: Number(values[userId]),
    }))

    if (splits.some((split) => !split[field] || split[field] <= 0)) {
      return { error: `Enter a positive ${field} for every participant.` }
    }

    const total = splits.reduce((sum, split) => sum + split[field], 0)
    if (splitType === 'UNEQUAL' && Math.abs(total - numericAmount) > 0.01) {
      return { error: 'Unequal split amounts must add up to the expense total.' }
    }
    if (splitType === 'PERCENTAGE' && Math.abs(total - 100) > 0.01) {
      return { error: 'Percentages must add up to 100.' }
    }

    return {
      payload: { description, amount: numericAmount, splitType, splits },
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const result = buildPayload()

    if (result.error) {
      setValidationError(result.error)
      return
    }

    setValidationError('')
    await onSubmit(result.payload)
  }

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <div
        aria-labelledby="expense-modal-title"
        aria-modal="true"
        className="modal-card wide-modal"
        role="dialog"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="modal-heading">
          <div>
            <h2 id="expense-modal-title">Add expense</h2>
            <p>Choose participants and how to split the total.</p>
          </div>
          <button
            aria-label="Close modal"
            className="icon-button"
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
          >
            &times;
          </button>
        </div>

        <form className="stack-form" onSubmit={handleSubmit}>
          <label htmlFor="expense-description">Description</label>
          <input
            id="expense-description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            required
          />

          <div className="two-column-form">
            <div>
              <label htmlFor="expense-amount">Amount</label>
              <input
                id="expense-amount"
                type="number"
                min="0.01"
                step="0.01"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="split-type">Split type</label>
              <select
                id="split-type"
                value={splitType}
                onChange={(event) => setSplitType(event.target.value)}
              >
                {SPLIT_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <fieldset className="participant-list">
            <legend>Participants</legend>
            {members.map((member) => {
              const userId = member.user.id
              const isSelected = selectedIds.includes(userId)
              return (
                <div className="participant-row" key={userId}>
                  <label>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleMember(userId)}
                    />
                    {member.user.name}
                  </label>
                  {splitType !== 'EQUAL' && isSelected && (
                    <input
                      aria-label={`${splitType} value for ${member.user.name}`}
                      type="number"
                      min="0.01"
                      step={splitType === 'SHARE' ? '1' : '0.01'}
                      placeholder={
                        splitType === 'UNEQUAL'
                          ? 'Amount'
                          : splitType === 'PERCENTAGE'
                            ? 'Percent'
                            : 'Shares'
                      }
                      value={values[userId] || ''}
                      onChange={(event) =>
                        updateValue(userId, event.target.value)
                      }
                      required
                    />
                  )}
                </div>
              )
            })}
          </fieldset>

          {selectedMembers.length > 0 && splitType === 'EQUAL' && (
            <p className="helper-text">
              Each participant pays{' '}
              {numericAmount > 0
                ? (numericAmount / selectedMembers.length).toFixed(2)
                : '0.00'}
            </p>
          )}

          {(validationError || apiError) && (
            <p className="form-error">{validationError || apiError}</p>
          )}

          <div className="modal-actions">
            <button
              className="secondary-button"
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              className="primary-button"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Create expense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateExpenseModal
