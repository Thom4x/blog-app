import LoginForm from './LoginForm'
import Message from './Message'
import Togglable from './Togglable'

const Login = ({ handleLogin, message, messageType, password, setUsername, setpassword, username }) => {

    const loginForm = () => (
        <Togglable buttonLabel='login'>
            <LoginForm
                handleLogin={handleLogin}
                message={message}
                messageType={messageType}
                password={password}
                setUsername={setUsername}
                setpassword={setpassword}
                username={username}
            />
        </Togglable>
    )
    return (
        <div>
            <h2>App To Blogs!</h2>
            <Message message={message} status={messageType} />
            {
                loginForm()
            }
        </div>
    )
}

export default Login