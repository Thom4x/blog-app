import { useState } from 'react'

const Blog = ({ blog, updateLikes, removeBlog, username }) => {

  const [detailsVisible, setDetailsVisible] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    borderWidth: 1,
    marginBottom: 5
  }

  const toggleDetails = () => {
    setDetailsVisible(!detailsVisible)
  }

  return (
    <div style={blogStyle} data-testid='blog' >
      {!detailsVisible ?
        <div>
          <p>{blog.title} - {blog.author} <button onClick={toggleDetails} data-testid='view'>view</button> </p>
        </div>
        :
        <ul style={{ ...blogStyle, listStyle: 'none', paddingLeft: 0 }} data-testid='blog-details'>
          <li>{blog.title} <button onClick={toggleDetails}>Hide</button></li>
          <li >{blog.author}</li>
          <li>{blog.url}</li>
          <li data-testid='likes'>{blog.likes} <button onClick={updateLikes} data-testid='like'>like</button></li>
          <li>{blog.user?.username}</li>
          {
            blog.user.username === username ? <button onClick={removeBlog} data-testid='remove'>Remove</button> : null
          }
        </ul>
      }
    </div>
  )
}

export default Blog