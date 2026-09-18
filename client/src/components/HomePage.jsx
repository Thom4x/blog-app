import Blog from "./Blog";
import { useBlog } from '../hooks/useStore'
import { useMatch } from "react-router-dom";
const HomePage = ({
    user,
}) => {
    const blogs = useBlog()
    const toSortedBlogs = blogs.toSorted((a, b) => b.likes - a.likes);


    return (
        <div>
            <h2>blogs</h2>

            {
                <div>
                    <ul>
                        {toSortedBlogs?.map((blog) => (
                            <li key={blog?.id}>
                                <Blog
                                    blog={blog}
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
