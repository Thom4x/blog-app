import LoginForm from "./LoginForm";
import Togglable from "./Togglable";
import { useState } from "react";
import blogService from '../services/blogs'
import { useNotificationActions, useUserActions } from "../hooks/useStore";
import { useNavigate } from "react-router-dom";
import { persistentUser } from "../services/persistentUser";
import { useField } from "../hooks/useField";
const Login = () => {
    const [isLoading, setIsLoading] = useState(false);

    const name = useField('text')
    const password = useField('password')

    const { setUsers } = useUserActions()
    const { setNotification } = useNotificationActions()
    const navigate = useNavigate()

    const handleLogin = async (event) => {
        event.preventDefault();
        if (!name.value.trim() || !password.value.trim()) {
            setNotification("Username y password son obligatorios", "error");
            return;
        }
        setIsLoading(true);
        try {
            const userLogin = await blogService.login({ username: name.value, password: password.value });
            blogService.setToken(userLogin.token);
            persistentUser.setUserLocalStorage(userLogin)
            setUsers(userLogin.username);
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
                name={name}
                password={password}
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
