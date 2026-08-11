const Message = ({ message, status }) => {
  if (!message) {
    return null
  }

  const className = status === 'success' ? 'success' : 'error'

  return (
    <div className={className}>
      {message}
    </div>
  )
}

export default Message