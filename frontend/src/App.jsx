import { useState, useEffect } from 'react'
import './App.css'
import Blog from './components/Blog'
import blogService from './services/blogs'
import LoginForm from './components/LoginForm'
import Message from './components/Message'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setpassword] = useState('');
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState('success');

  useEffect(() => {
    blogService
      .getAll()
      .then(data =>
        setBlogs(data)
      )
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await blogService.login({ username, password })
      blogService.setToken(user.token)
      setUser(user.username)
      setUsername('');
      setpassword('');
      setMessage(`Welcome ${user.username}`)
      setTimeout(() => {
        setMessage(null)
      }, 3000);
    } catch (error) {
      console.log("Error CLI:", error)
      setMessageType('error')
      if (error.response) {
        if (error.response.status === 401) {
          setMessage('Invalid username or password')
        } else {
          setMessage(`Ocurrió un problema en el servidor.Inténtalo más tarde.`)
        }
      } else {
        setMessage('No se pudo conectar con el servidor. Revisa tu conexión.')
      }
      setTimeout(() => {
        setMessage(null)
        setMessageType('success')
      }, 3000);
    }
  }

  const logout = () => {
    blogService.setToken(null);
    localStorage.removeItem('loggedBlogappUser');
    setUser(null)
  }

  const handleBlogForm = async (data) => {
    try {
      const newBlog = await blogService.create(data)
      setBlogs(blogs.concat(newBlog))
      setMessage(`A new blog "${newBlog.title}" by ${newBlog.author} added`)
      setTimeout(() => {
        setMessage(null)
      }, 5000);
    } catch (error) {
      console.log("Error CLI:", error)
      setMessage(`Error creating blog ${error}`)
      setMessageType('error')
      setTimeout(() => {
        setMessage(null)
        setMessageType('success')
      }, 3000);
    }
  }

  const updateLikesBtn = async (blog, id) => {
    try {
      const updatedBlog = {
        ...blog,
        likes: blog.likes + 1
      }
      const returnedBlog = await blogService.update(id, updatedBlog)
      setBlogs(blogs.map(b => b._id !== blog._id ? b : returnedBlog))
      setMessage('Up!')
      setTimeout(() => {
        setMessage(null)
      }, 1000);
    } catch (error) {
      console.log("Error Likes", error)
      setMessage(`Like update Error ${error}`)
      setMessageType('error')
      setTimeout(() => {
        setMessage(null)
        setMessageType('success')
      }, 3000);
    }
  }


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


  const blogForm = () => (
    <Togglable buttonLabel='create blog'>
      <BlogForm
        createBlog={handleBlogForm}
      />
    </Togglable>
  )

  return (
    <div>
      <h2>App To Blogs!</h2>
      <Message message={message} status={messageType} />

      {!user &&
        loginForm()}
      {user &&
        <div>
          <p>{user} logged in <button onClick={logout}>logout</button></p>
          {blogForm()}
          {
            blogs.toSorted((a, b) => b.likes - a.likes).map(blog => <Blog updateLikes={() => updateLikesBtn(blog, blog._id)} key={blog._id} blog={blog} />)
          }

        </div>}

      <br />

    </div >
  )
}

export default App