import { useEffect, useState } from 'react'
import api, { getApiError } from '../services/api'
import socket from '../services/socket'

function ChatBox({ expenseId }) {
  const [comments, setComments] = useState([])
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [isSending, setIsSending] = useState(false)

  useEffect(() => {
    if (!socket.connected) socket.connect()
    socket.emit('joinExpense', expenseId)

    const handleComment = (comment) => {
      if (Number(comment.expenseId) === Number(expenseId)) {
        setComments((current) => [...current, comment])
      }
    }

    socket.on('newComment', handleComment)
    return () => socket.off('newComment', handleComment)
  }, [expenseId])

  // Try to load existing comments if the API exposes them.
  useEffect(() => {
    let mounted = true

    const loadComments = async () => {
      try {
        const response = await api.get(`/api/expenses/${expenseId}/comments`)
        if (!mounted) return
        if (Array.isArray(response.data.comments)) {
          setComments(response.data.comments)
        }
      } catch (err) {
        // API may not expose a GET endpoint for comments; ignore silently
      }
    }

    loadComments()

    return () => {
      mounted = false
    }
  }, [expenseId])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setIsSending(true)

    try {
      await api.post(`/api/expenses/${expenseId}/comments`, { message })
      setMessage('')
    } catch (requestError) {
      setError(getApiError(requestError, 'Could not send comment.'))
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="chat-box">
      <div className="comment-list">
        {comments.length === 0 && <p>No comments in this session yet.</p>}
        {comments.map((comment) => (
          <div className="comment" key={comment.id}>
            <strong>{comment.user?.name || `User ${comment.userId}`}</strong>
            <span>{comment.message}</span>
          </div>
        ))}
      </div>
      <form className="inline-form" onSubmit={handleSubmit}>
        <input
          aria-label="Comment"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Write a comment"
          required
        />
        <button className="primary-button" type="submit" disabled={isSending}>
          Send
        </button>
      </form>
      {error && <p className="form-error">{error}</p>}
    </div>
  )
}

export default ChatBox
