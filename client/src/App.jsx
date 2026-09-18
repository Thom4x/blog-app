import { useEffect } from "react";
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
import { useBlog, useBlogActions, useBlogLoading, useUser, useUserActions } from "./hooks/useStore";
import blogService from "./services/blogs";
const App = () => {
  const { getBlogs } = useBlogActions();
  const user = useUser();
  const { clearUser, setUsers } = useUserActions();
  const blog = useBlog();
  const blogLoading = useBlogLoading();
  useEffect(() => {
    getBlogs();
  }, [getBlogs]);

  useEffect(() => {
    const loggedUserJSON = localStorage.getItem("loggedBlogappUser");

    if (!loggedUserJSON) {
      return;
    }

    try {
      const loggedUser = JSON.parse(loggedUserJSON);
      blogService.setToken(loggedUser.token);
      setUsers(loggedUser.username);
    } catch {
      localStorage.removeItem("loggedBlogappUser");
    }
  }, [setUsers]);

  const logout = () => {
    blogService.setToken(null);
    localStorage.removeItem("loggedBlogappUser");
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
