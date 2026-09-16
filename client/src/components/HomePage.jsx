import Blog from "./Blog";
import { useBlog } from '../hooks/useStore'
const HomePage = ({
    user,
    updateLikesBtn,
    removeBlog,
}) => {
    const blogs = useBlog()
    const toSortedBlogs = blogs.toSorted((a, b) => b.likes - a.likes);
    return (
        <div>
            <h2>blogs</h2>

            {
                <div>
                    <ul>
                        {toSortedBlogs.map((blog) => (
                            <li key={blog.id}>
                                <Blog
                                    blog={blog}
                                    updateLikes={updateLikesBtn}
                                    removeBlog={removeBlog}
                                    username={user}
                                    user={user}
                                />
                            </li>
                        ))}
                    </ul>
                </div>
            }
        </div>
    );
};

export default HomePage;
