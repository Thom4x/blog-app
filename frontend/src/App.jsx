import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setpassword] = useState('');
  const [user, setUser] = useState(null);


  useEffect(() => {
    blogService
      .getAll()
      .then(data =>
        setBlogs(data)
      )
  }, []) // [] esto significa que el efecto se ejecuta solo una vez, después del primer renderizado

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await blogService.login({ username, password })
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      setUser(username)
      setUsername('');
      setpassword('');
    } catch (error) {
      setTimeout(() => {
        console.log("Wrong credentials", error)
      }, 5000);
    }
  }

  console.log("username", username)
  console.log("password", password)
  console.log("user", user)
  if (user === null) return (
    <div>
      <h2>Log in to application</h2>
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
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App