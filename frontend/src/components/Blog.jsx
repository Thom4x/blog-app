import { Link, useMatch } from 'react-router-dom'
import Message from './Message'

const Blog = ({ blog, updateLikes, removeBlog, message, messageType, user }) => {
  const match = useMatch('/blogs/:id')
  const isDetailPage = match && match.params.id === blog.id

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <div>
      {
        isDetailPage ?
          <div style={blogStyle} data- testid='blog' >
            <Message message={message} status={messageType} />
            <h2>{blog.title} - {blog.author}</h2>
            <p><a href={blog.url} target="_blank" rel="noopener noreferrer">{blog.url}</a></p>
            <p>{blog.likes} likes{' '}
              {user &&
                <button onClick={() => updateLikes(blog, blog.id)} data-testid="like-button">like</button>
              }
            </p>

            <p>Added by {blog.user?.username || 'Unknown'}</p>
            {user === blog.user?.username ?
              <button onClick={() => removeBlog(blog.id)}>remove</button> :
              <p>-_-</p>
            }
          </div >
          :

          <div>
            <div style={blogStyle} data-testid='blog'>

              <Link to={`/blogs/${blog.id}`}>{blog.title} - {blog.author}</Link>
            </div>
          </div>
      }
    </div>
  )
}

export default Blog