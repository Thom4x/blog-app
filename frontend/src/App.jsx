import { useState, useEffect } from 'react'
import {
  Routes, Route, Link, useMatch, useNavigate, useParams
} from 'react-router-dom'

import './App.css'
import HomePage from './components/HomePage'
import Blog from './components/Blog'
import blogService from './services/blogs'
import LoginForm from './components/LoginForm'
import Message from './components/Message'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import Login from './components/Login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setpassword] = useState('')
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)
  const [messageType, setMessageType] = useState('success')
  const navigate = useNavigate()
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
      setUsername('')
      setpassword('')
      navigate('/')
      setMessage(`Welcome ${user.username}`)
      setTimeout(() => {
        setMessage(null)
      }, 1000)
    } catch (error) {
      console.log('Error CLI:', error)
      setMessageType('error')
      if (error.response) {
        if (error.response.status === 401) {
          setMessage('Invalid username or password')
        } else {
          setMessage('Ocurrió un problema en el servidor.Inténtalo más tarde.')
        }
      } else {
        setMessage('No se pudo conectar con el servidor. Revisa tu conexión.')
      }
      setTimeout(() => {
        setMessage(null)
        setMessageType('success')
      }, 1000)
    }
  }

  const logout = () => {
    blogService.setToken(null)
    localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  const handleBlogForm = async (data) => {
    try {
      const newBlog = await blogService.create(data)
      setBlogs(blogs.concat(newBlog))
      setMessage(`A new blog "${newBlog.title}" by ${newBlog.author} added`)
      navigate('/')
      setTimeout(() => {
        setMessage(null)
      }, 2000)
    } catch (error) {
      console.log('Error CLI:', error)
      if (error.response.status === 401) {
        setMessage('No estas autorizado para crear un blog. Inicia sesión primero.')
      } else {
        setMessage(`Error creating blog ${error}`)
      }
      setMessageType('error')
      setTimeout(() => {
        setMessage(null)
        setMessageType('success')
      }, 3000)
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
      }, 1000)
    } catch (error) {
      console.log('Error Likes', error)
      setMessage(`Like update Error ${error}`)
      setMessageType('error')
      setTimeout(() => {
        setMessage(null)
        setMessageType('success')
      }, 2000)
    }
  }

  const removeBlog = async (id) => {
    if (window.confirm(`Deseas eliminar este blog? ${id}`)) {
      try {
        const eliminated = await blogService.deleteBlog(id)
        console.log('Yes, eliminated', eliminated)
        navigate('/')
        setBlogs(blogs.filter(b => b._id !== id))
        setMessage(`Has eliminado el blog: ${blogs.find(b => b._id === id).title}`)
        setTimeout(() => {
          setMessage(null)
          setMessageType('success')
        }, 5000)
      } catch (error) {
        console.log('Error deleting blog', error)
        setMessageType('error')
        if (error.response) {
          if (error.response.status === 401) {
            setMessage('No estas autorizado para eliminar este blog')
          } else {
            setMessage('Ocurrió un problema en el servidor.Inténtalo más tarde.')
          }
        }
        setTimeout(() => {
          setMessage(null)
          setMessageType('success')
        }, 1000)
      }
    }

  }

  const blogForm = () => (
    <Togglable buttonLabel='create blog'>
      <BlogForm
        createBlog={handleBlogForm}
      />
    </Togglable>
  )
  const match = useMatch('/blogs/:id')
  const blogInFocus = match ? blogs.find(b => b.id === match.params.id) : null
  return (
    <div>
      <div>
        <Link style={{ padding: 5 }} to={'/blogs'}>blogs</Link>
        <Link style={{ padding: 5 }} to={'/login'}>login</Link>
        <Link style={{ padding: 5 }} to={'/'}>base</Link>
        {
          user &&
          <span><Link style={{ padding: 5 }} to={'/create'}>new blog</Link></span>
        }

      </div>

      <Routes>
        <Route path='/login' element={<Login
          handleLogin={handleLogin}
          message={message}
          messageType={messageType}
          password={password}
          setUsername={setUsername}
          setpassword={setpassword}
          username={username}
        />}></Route>
        <Route path='/' element={
          <HomePage
            message={message}
            messageType={messageType}
            user={user}
            blogForm={blogForm}
            blogs={blogs}
            updateLikesBtn={updateLikesBtn}
            removeBlog={removeBlog}
            logout={logout}
          />
        }></Route>
        <Route path='/blogs/:id' element={<Blog
          blog={blogInFocus}
          updateLikes={updateLikesBtn}
          removeBlog={removeBlog}
          username={user}
          message={message}
          messageType={messageType}
          user={user}
        />}></Route>
        <Route path='/create' element={<BlogForm
          createBlog={handleBlogForm}
          message={message}
          messageType={messageType}
        />}></Route>
      </Routes>

      <div>
      </div >
    </div>
  )
}

export default App