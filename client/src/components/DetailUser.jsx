import React from 'react'
import { useMatch } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Button, Typography, Box } from "@mui/material";
const DetailUser = ({ user }) => {
    const match = useMatch("/users/:id");
    const isDetailPage = match && match.params.id === user?.id;

    const blogStyle = {
        paddingTop: 10,
        paddingLeft: 2,
        borderWidth: 1,
        marginBottom: 5,
    };

    return (
        <div>
            {isDetailPage
                ? (
                    <div style={blogStyle} data-testid="blog">
                        <Box
                            sx={{
                                maxWidth: 600,
                                border: "1px solid #ccc",
                                padding: "10px",
                                borderRadius: "5px",
                            }}
                        >
                            <Typography variant="h5">{user.name}</Typography>
                            <Typography variant="subtitle1">Added Blogs</Typography>

                            {user.blogs.length === 0 ? (
                                <Typography variant="subtitle1">Este usuario no tiene blogs creados</Typography>
                            ) : (
                                <ul>
                                    {user.blogs?.map((u) => (
                                        <li key={u.id}>
                                            <Typography variant="body2">{u.title}</Typography>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </Box>
                    </div >
                ) : (
                    <div>
                        <div style={blogStyle} data-testid="user">
                            <Link to={`/users/${user?.id}`}>
                                {user.name}
                            </Link>
                        </div>
                    </div>
                )}
        </div >
    )
}

export default DetailUser
