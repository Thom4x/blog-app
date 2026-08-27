import Message from './Message'
import Blog from './Blog'
const HomePage = ({ message, messageType, user, blogs, updateLikesBtn, removeBlog, logout }) => {
    return (
        <div>
            <h2>blogs</h2>
            <Message message={message} status={messageType} />
            {
                <div>
                    {
                        user &&
                        <p>{user} logged in <button onClick={logout}>logout</button></p>
                    }

                    <ul>
                        {blogs.toSorted((a, b) => b.likes - a.likes).map(blog =>
                            <li key={blog.id}>
                                <Blog blog={blog} updateLikes={updateLikesBtn} removeBlog={removeBlog} username={user} message={message} messageType={messageType} user={user} />
                            </li>
                        )}
                    </ul>
                </div>
            }
        </div>
    )
}

export default HomePage