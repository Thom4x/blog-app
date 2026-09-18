/* eslint-disable indent */
import { Button, TextField } from "@mui/material";
import { useNotificationActions, useBlogActions } from "../hooks/useStore";
import { useField } from "../hooks/useField";
import { useNavigate } from "react-router-dom";
const BlogForm = () => {

  const title = useField('text')
  const author = useField('text')
  const url = useField('text')

  const { setNotification, clearNotification } = useNotificationActions()
  const { createBlog } = useBlogActions()
  const navigate = useNavigate()

  const handleBlogForm = async (event) => {
    event.preventDefault();
    if (!title.value || !author.value || !url.value) {
      setNotification('No puedes crear un blog vacio, ingresa contenido en los tres', 'error');
      setTimeout(() => {
        clearNotification()
      }, 1500)

    } else {
      try {
        const newBlog = {
          title: title.value,
          author: author.value,
          url: url.value,
        }
        createBlog(newBlog)
        navigate('/')
      } catch (error) {
        console.log(error)
      }
    }
  };

  return (
    <div>
      <br />
      <h2>Create a new blog</h2>
      <form
        onSubmit={handleBlogForm}
        style={{
          display: "flex",
          flexDirection: "column",
          width: "240px",
          gap: "10px",
        }}
      >
        <TextField
          label="title:"
          name="title"
          {...title}
        />

        <TextField
          label="author:"
          name="author"
          {...author}
        />

        <TextField
          label="url:"
          name="url"
          {...url}
        />

        <Button type="submit" variant="contained" style={{ width: "90px" }}>
          Create
        </Button>
      </form>
    </div>
  );
};

export default BlogForm;
