const BlogForm = ({ handleBlogForm, typeBlog, handleInputChange }) => {
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
                            onChange={handleInputChange}
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
                            onChange={handleInputChange}
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
                            onChange={handleInputChange}
                        />
                    </label>
                </div>
                <button type='submit'>Create</button>
            </form>
        </div>
    )
}

export default BlogForm;