import { useState, useEffect } from "react";
import { Routes, Route, Link, useMatch, useNavigate } from "react-router-dom";
import { Container, AppBar, Toolbar, Button, Typography } from "@mui/material";
import "./App.css";
import HomePage from "./components/HomePage";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import Message from "./components/Message";
import Togglable from "./components/Togglable";
import BlogForm from "./components/BlogForm";
import Login from "./components/Login";
import ErrorBoundary from "./components/ErrorBoundary";
import PageNotFound from "./components/PageNotFound";
import { useNotificationActions, useBlog, useBlogActions } from "./hooks/useStore";

const App = () => {
  const [username, setUsername] = useState("");
  const [password, setpassword] = useState("");
  const [user, setUser] = useState(null);

  const { setNotification, clearNotification } = useNotificationActions()
  const { getBlogs } = useBlogActions();
  const navigate = useNavigate();

  const blog = useBlog()
  useEffect(() => {
    getBlogs();
  }, [getBlogs]);

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await blogService.login({ username, password });
      blogService.setToken(user.token);
      setUser(user.username);
      setUsername("");
      setpassword("");
      navigate("/");
      setNotification(`Welcome BROK ${user.username}`, "success", 2500);
      setTimeout(() => {
        clearNotification();
      }, 2500);
    } catch (error) {
      setNotification(`Error en el login: ${error.message}`, "error", 2500);
      if (error.response) {
        if (error.response.status === 401) {
          setNotification(`Invalid username or password`, "error", 2000);
        } else {
          setNotification("Ocurrió un problema en el servidor.Inténtalo más tarde.", "error", 2500);
        }
      } else {
        setNotification("No se pudo conectar con el servidor. Revisa tu conexión.", "error", 2500);
      }
      setTimeout(() => {
        clearNotification();
      }, 2000);
    }
  };

  const logout = () => {
    blogService.setToken(null);
    localStorage.removeItem("loggedBlogappUser");
    setUser(null);
  };





  const match = useMatch("/blogs/:id");
  const blogInFocus = match
    ? blog.find((b) => b.id === match.params.id)
    : null;


  const hoverStyle = { "&:hover": { bgcolor: "rgba(228, 207, 207, 0.32)" } };
  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Blog App
          </Typography>
          <Button component={Link} to={"/"} sx={hoverStyle} color="inherit">
            blogs
          </Button>
          <Button
            component={Link}
            to={"/login"}
            sx={hoverStyle}
            color="inherit"
          >
            login
          </Button>
          {user && (
            <Button
              component={Link}
              to={"/"}
              sx={hoverStyle}
              color="inherit"
              onClick={logout}
            >
              logout
            </Button>
          )}
          {user && (
            <Button
              component={Link}
              to={"/create"}
              sx={hoverStyle}
              color="inherit"
            >
              new blog
            </Button>
          )}
        </Toolbar>

      </AppBar>
      <br />
      <Message />
      <ErrorBoundary>
        <Routes>
          <Route
            path="/login"
            element={
              <Login
                handleLogin={handleLogin}
                password={password}
                setUsername={setUsername}
                setpassword={setpassword}
                username={username}
              />
            }
          ></Route>
          <Route
            path="/"
            element={
              <HomePage
                user={user}
                logout={logout}
              />
            }
          ></Route>
          <Route
            path="/blogs/:id"
            element={
              <Blog
                blog={blogInFocus}
                username={user}
                user={user}
              />
            }
          ></Route>
          <Route
            path="/create"
            element={
              <BlogForm />
            }
          ></Route>
          <Route
            path="*"
            element={
              <PageNotFound />}>
          </Route>

        </Routes>
      </ErrorBoundary>

      <div></div>
    </div>
  );
};

export default App;
