import Blog from "./Blog";
import { useBlog } from '../hooks/useStore'
import Typography from '@mui/material/Typography';
const HomePage = () => {
    const blogs = useBlog().toSorted((a, b) => b.likes - a.likes);

    return (
        <div>
            <Typography variant="h5">Blogs</Typography>
            {
                <div>
                    <ul>
                        {blogs?.map((blog) => (
                            <li key={blog?.id} style={{ textDecoration: 'none', color: 'black' }}>
                                <Typography variant="subtitle1" sx={{ color: 'black', textDecoration: 'none' }}>
                                    <Blog blog={blog} />
                                </Typography>
                            </li>
                        ))}
                    </ul>
                </div>

            }
        </div>
    );
};

export default HomePage;
