import { Link, useMatch, useNavigate } from 'react-router-dom'
import { Button, Typography, Box } from "@mui/material";
import { useBlogActions, useUser } from '../hooks/useStore';

const Blog = ({ blog }) => {
  const { likeBlog, deleteBlog } = useBlogActions()
  const user = useUser()
  const navigate = useNavigate()
  const match = useMatch("/blogs/:id");
  const isDetailPage = match && match.params.id === blog?.id;

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    borderWidth: 1,
    marginBottom: 5,
  };
  const handleDelete = (id) => {
    deleteBlog(id)
    navigate("/");
  }

  return (
    <div>
      {isDetailPage
        ? (
          <div style={blogStyle} data-testid="blog">
            <Box
              sx={{
                maxWidth: 600,
                border: "1px solid #ccc",
                padding: "10px",
                borderRadius: "5px",
              }}
            >
              <Typography variant="h5">{blog.title}</Typography>
              <Typography variant="subtitle1">by {blog.author}</Typography>
              <Typography variant="body2">
                <a href={blog.url} target="_blank" rel="noopener noreferrer">
                  {blog.url}
                </a>
              </Typography>
              <Typography variant="body2">
                Added by {blog.user?.username || "Unknown"}
              </Typography>

              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: "10px",
                  alignItems: "center",
                  marginTop: "10px",
                }}
              >
                <Typography variant="body2">{blog.likes} likes</Typography>

                {user && (
                  <Button
                    variant="outlined"
                    onClick={() => likeBlog(blog.id)}
                    data-testid="like-button"
                  >
                    like
                  </Button>
                )}

                {user && user === blog.user?.username && (
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleDelete(blog.id)}
                    data-testid="remove-button"
                  >
                    remove
                  </Button>
                )}

              </div>
              <br />
              <Typography variant="h5">comments</Typography>
              {blog.comments.length > 0 ?
                <ul>
                  {blog.comments?.map((u) =>
                    <li key={u._id}><Typography variant="subtitle1">{u.text}</Typography></li>
                  )
                  }
                </ul>
                :
                <p>Este blog no tiene comentarios</p>
              }
            </Box>
          </div>
        ) : (
          <div>
            <div style={blogStyle} data-testid="blog">
              <Link to={`/blogs/${blog?.id}`}>
                {blog?.title} - {blog?.author}
              </Link>
            </div>
          </div>
        )}
    </div>
  );
};

export default Blog;
