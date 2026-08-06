import { useState } from "react"

const Blog = ({ blog, updateLikes }) => {
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
    <div style={blogStyle}>
      {!detailsVisible ?
        <div>
          <p>{blog.title} - {blog.author} <button onClick={toggleDetails}>View</button> </p>
        </div>
        :
        <ul style={{ ...blogStyle, listStyle: 'none', paddingLeft: 0 }}>
          <li>{blog.title} <button onClick={toggleDetails}>Hide</button></li>
          <li>{blog.author}</li>
          <li>{blog.url}</li>
          <li>{blog.likes} <button onClick={updateLikes}>Like</button></li>
          <li>{blog.user?.username}</li>
        </ul>}
    </div>
  )
}

export default Blog