import { useState } from "react";

const BlogForm = ({ createBlog }) => {
    const [typeBlog, setTypeBlog] = useState({ title: '', author: '', url: '' });

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
            <form onSubmit={handleBlogForm}>
                <div>
                    <label>
                        title:
                        <input
                            type="text"
                            name="title"
                            value={typeBlog.title}
                            onChange={(event) => setTypeBlog({ ...typeBlog, title: event.target.value })}
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
                            onChange={(event) => setTypeBlog({ ...typeBlog, author: event.target.value })}
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
                            onChange={(event) => setTypeBlog({ ...typeBlog, url: event.target.value })}
                        />
                    </label>
                </div>
                <button type='submit'>Create</button>
            </form>
        </div>
    )
}

export default BlogForm;