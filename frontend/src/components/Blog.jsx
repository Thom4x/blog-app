import { Link, useMatch } from 'react-router-dom'
import Message from './Message'
import { Button, Container, Typography, Box } from '@mui/material'
const Blog = ({ blog, updateLikes, removeBlog, user }) => {
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


          <div style={blogStyle} data-testid='blog' >
            <Box
              sx={{
                maxWidth: 600,
                border: '1px solid #ccc',
                padding: '10px',
                borderRadius: '5px'
              }}
            >
              <Typography variant="h5">{blog.title}</Typography>
              <Typography variant="subtitle1">by {blog.author}</Typography>
              <Typography variant="body2">
                <a href={blog.url} target="_blank" rel="noopener noreferrer">{blog.url}</a>
              </Typography>
              <Typography variant="body2">Added by {blog.user?.username || 'Unknown'}</Typography>

              <div style={{ display: 'flex', flexDirection: 'row', gap: '10px', alignItems: 'center', marginTop: '10px' }}>
                <Typography variant="body2">{blog.likes} likes</Typography>

                {user && (
                  <Button
                    variant="outlined"
                    onClick={() => updateLikes(blog, blog.id)}
                    data-testid="like-button"
                  >
                    like
                  </Button>
                )}

                {user && user === blog.user?.username && (
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => removeBlog(blog.id)}
                    data-testid="remove-button"
                  >
                    remove
                  </Button>
                )}
              </div>
            </Box>
          </div >
          :
          <div>
            <div style={blogStyle} data-testid='blog'>

              <Link to={`/blogs/${blog.id}`}>{blog.title} - {blog.author}</Link>
            </div>
          </div>
      }
    </div >
  )
}

export default Blog