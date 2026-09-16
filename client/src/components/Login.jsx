import LoginForm from "./LoginForm";
import Message from "./Message";
import Togglable from "./Togglable";

const Login = ({
    handleLogin,
    password,
    setUsername,
    setpassword,
    username,
}) => {
    const loginForm = () => (
        <Togglable buttonLabel="login">
            <LoginForm
                handleLogin={handleLogin}
                password={password}
                setUsername={setUsername}
                setpassword={setpassword}
                username={username}
            />
        </Togglable>
    );
    return (
        <div>
            <h2>App To Blogs!</h2>
            {loginForm()}
        </div>
    );
};

export default Login;
