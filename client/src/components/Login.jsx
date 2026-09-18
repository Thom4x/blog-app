import LoginForm from "./LoginForm";
import Togglable from "./Togglable";
import { useState } from "react";
import blogService from '../services/blogs'
import { useNotificationActions, useUserActions } from "../hooks/useStore";
import { useNavigate } from "react-router-dom";
const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { setUsers } = useUserActions()
    const { setNotification } = useNotificationActions()
    const navigate = useNavigate()

    const handleLogin = async (event) => {
        event.preventDefault();

        if (!username.trim() || !password) {
            setNotification("Username y password son obligatorios", "error");
            return;
        }

        setIsLoading(true);
        try {
            const userLogin = await blogService.login({ username, password });
            blogService.setToken(userLogin.token);
            localStorage.setItem("loggedBlogappUser", JSON.stringify(userLogin));

            setUsers(userLogin.username);

            setUsername("");
            setPassword("");
            navigate("/");
            setNotification(`Welcome ${userLogin.username}`, "success");
        } catch (error) {
            let message = "Ocurrió un problema al iniciar sesión.";

            if (!error.response) {
                message = "No se pudo conectar con el servidor.";
            } else if (error.response.status === 401) {
                message = "Username o password incorrectos.";
            }

            setNotification(message, "error");
        } finally {
            setIsLoading(false);
        }
    }



    const loginForm = () => (
        <Togglable buttonLabel="login">
            <LoginForm
                handleLogin={handleLogin}
                password={password}
                setUsername={setUsername}
                setPassword={setPassword}
                username={username}
                isLoading={isLoading}
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
