/* eslint-disable indent */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, TextField } from "@mui/material";
import { useNotificationActions, useBlogActions } from "../hooks/useStore";

const BlogForm = () => {
  const [typeBlog, setTypeBlog] = useState({ title: "", author: "", url: "" });

  const { setNotification, clearNotification } = useNotificationActions()
  const { createBlog } = useBlogActions()
  const navigate = useNavigate();

  const handleBlogForm = async (event) => {
    event.preventDefault();
    if (!typeBlog.title || !typeBlog.author || !typeBlog.url) {
      setNotification('No puedes crear un blog vacio, ingresa contenido en los tres', 'error');
      setTimeout(() => {
        clearNotification()
      }, 1500)

    } else {
      try {
        const newBlog = {
          title: typeBlog.title,
          author: typeBlog.author,
          url: typeBlog.url,
        }
        createBlog(newBlog)
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
          type="text"
          name="title"
          value={typeBlog.title}
          onChange={(event) =>
            setTypeBlog({ ...typeBlog, title: event.target.value })
          }
        />

        <TextField
          label="author:"
          type="text"
          name="author"
          value={typeBlog.author}
          onChange={(event) =>
            setTypeBlog({ ...typeBlog, author: event.target.value })
          }
        />

        <TextField
          label="url:"
          type="text"
          name="url"
          value={typeBlog.url}
          onChange={(event) =>
            setTypeBlog({ ...typeBlog, url: event.target.value })
          }
        />

        <Button type="submit" variant="contained" style={{ width: "90px" }}>
          Create
        </Button>
      </form>
    </div>
  );
};

export default BlogForm;
