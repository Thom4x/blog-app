import { useState, useEffect } from 'react'
import './App.css'
import Blog from './components/Blog'
import blogService from './services/blogs'

const StatusMessage = ({ message, status }) => {
  if (!message) return null

  const className = status === 'success' ? 'success' : 'error'

  return (
    <div className={className}>
      {message}
    </div>
  )
}


const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [typeBlog, setTypeBlog] = useState({ title: '', author: '', url: '' });
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
      setUser(username)
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

  const handleBlogForm = async (event) => {
    event.preventDefault()
    try {
      const newBlog = await blogService.create(typeBlog)
      setBlogs(blogs.concat(newBlog))
      setTypeBlog({ title: '', author: '', url: '' })
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

  const handleInputChange = (event) => {
    const { name, value } = event.target
    setTypeBlog(typeBlog =>
    ({
      ...typeBlog,
      [name]: value
    }))
  }

  if (user === null) return (
    <div>
      <h2>Log in to application</h2>
      <StatusMessage message={message} status={messageType} />
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
        <button type='submit'>Login</button>
      </form>
    </div>
  )
  return (
    <div>

      <h2>blogs</h2>
      <StatusMessage message={message} status={messageType} />
      <div style={{ display: 'inline-block' }}>
        <span>{user} logged in</span>
        <button onClick={logout} style={{ marginLeft: '10px' }}>logout</button>
      </div>

      <h2>Create new</h2>
      <div>
        <form onSubmit={handleBlogForm}>
          <div>
            <label>
              title:
              <input
                type="text"
                name="title"
                value={typeBlog.title}
                onChange={handleInputChange}
              />
            </label>
          </div>
          <div>
            <label>
              author:
              <input
                type="text"
                name="author"
                value={typeBlog.author}
                onChange={handleInputChange}
              />
            </label>
          </div>
          <div>
            <label>
              url:
              <input
                type="text"
                name="url"
                value={typeBlog.url}
                onChange={handleInputChange}
              />
            </label>
          </div>
          <button type='submit'>Create</button>
        </form>
      </div>
      <br />
      {blogs.map(blog =>
        <Blog key={blog._id} blog={blog} />
      )}
    </div>
  )
}

export default App