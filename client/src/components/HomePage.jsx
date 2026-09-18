import Blog from "./Blog";
import { useBlog } from '../hooks/useStore'
const HomePage = () => {
    const blogs = useBlog().toSorted((a, b) => b.likes - a.likes);

    return (
        <div>
            <h2>blogs</h2>
            {
                <div>
                    <ul>
                        {blogs?.map((blog) => (
                            <li key={blog?.id}>
                                <Blog
                                    blog={blog}
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
