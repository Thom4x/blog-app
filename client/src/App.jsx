import { useEffect, useState } from "react";
import { Routes, Route, Link, useMatch } from "react-router-dom";
import { Container, AppBar, Toolbar, Button, Typography } from "@mui/material";
import "./App.css";
import HomePage from "./components/HomePage";
import Blog from "./components/Blog";
import Message from "./components/Message";
import BlogForm from "./components/BlogForm";
import Login from "./components/Login";
import ErrorBoundary from "./components/ErrorBoundary";
import PageNotFound from "./components/PageNotFound";
import Users from "./components/Users";
import { useBlog, useBlogActions, useBlogLoading, useUser, useUserActions } from "./hooks/useStore";
import blogService from "./services/blogs";
import { persistentUser } from "./services/persistentUser";
const App = () => {
  const { getBlogs } = useBlogActions();
  const { clearUser, setUsers, initializeUsers } = useUserActions();

  const blog = useBlog();
  const blogLoading = useBlogLoading();
  const user = useUser();

  useEffect(() => {
    // 1. Lógica de autenticación / token del usuario
    try {
      getBlogs();
      initializeUsers();
    } catch (error) {
      console.log("error obteniendo informacion", error);
    }

    const userJSON = persistentUser.getUserLocalStorage();
    try {
      blogService.setToken(userJSON.token);
      setUsers(userJSON.username);
    } catch {
      persistentUser.removeUserLocalStorage();
    }

    // 2. Carga de datos

  }, [getBlogs, setUsers, initializeUsers]);

  const logout = () => {
    blogService.setToken(null);
    persistentUser.removeUserLocalStorage();
    clearUser(null);
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
          {user &&
            <Button
              component={Link}
              to={"/users"}
              sx={hoverStyle}
              color="inherit">
              users
            </Button>
          }
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
              <Login />
            }
          ></Route>
          <Route
            path="/"
            element={
              <HomePage
              />
            }
          ></Route>
          <Route
            path="/blogs/:id"
            element={
              blogLoading ? (
                <p>Loading...</p>
              ) : blogInFocus ? (
                <Blog blog={blogInFocus} />
              ) : (
                <PageNotFound />
              )
            }
          />
          <Route
            path="/create"
            element={
              <BlogForm />
            }
          ></Route>
          <Route
            path="/users"
            element={
              <Users />
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
    </div >
  );
};

export default App;
