/* eslint-disable indent */
import { useState } from 'react'
import { Button, TextField } from '@mui/material'
import Message from './Message'
const BlogForm = ({ createBlog, message, messageType }) => {
    const [typeBlog, setTypeBlog] = useState({ title: '', author: '', url: '' })
    const handleBlogForm = (event) => {
        event.preventDefault()
        createBlog({
            title: typeBlog.title,
            author: typeBlog.author,
            url: typeBlog.url
        })
        setTypeBlog('')
    }

    return (

        <div>
            <br />
            <h2>Create a new blog</h2>
            <Message message={message} status={messageType} />
            <form onSubmit={handleBlogForm} style={{ display: 'flex', flexDirection: 'column', width: '240px', gap: '10px' }}>
                <TextField
                    label="title:"
                    type="text"
                    name="title"
                    value={typeBlog.title}
                    onChange={(event) => setTypeBlog({ ...typeBlog, title: event.target.value })}
                />

                <TextField
                    label="author:"
                    type="text"
                    name="author"
                    value={typeBlog.author}
                    onChange={(event) => setTypeBlog({ ...typeBlog, author: event.target.value })}
                />

                <TextField
                    label="url:"
                    type="text"
                    name="url"
                    value={typeBlog.url}
                    onChange={(event) => setTypeBlog({ ...typeBlog, url: event.target.value })}
                />

                <Button type='submit' variant='contained' style={{ width: '90px' }}>Create</Button>
            </form>
        </div >
    )
}

export default BlogForm