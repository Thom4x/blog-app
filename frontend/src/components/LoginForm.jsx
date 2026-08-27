import Message from './Message'
import {
  useNavigate
} from 'react-router-dom'

const LoginForm = ({ setUsername, setpassword, handleLogin, username, password }) => {
  const navigate = useNavigate()
  return (
    <div>
      <h2>Log in to application</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>
            username
            <input type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)} />
          </label>
        </div>
        <div>
          <label>
            password
            <input type="password"
              value={password}
              onChange={(event) => setpassword(event.target.value)}
            />
          </label>
        </div>
        <button type='submit' onClick={() => navigate('/')}>Login</button>
      </form>
    </div>
  )
}

export default LoginForm