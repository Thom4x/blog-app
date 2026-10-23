import jwt from "jsonwebtoken";
import User from "../models/user.js";
import Blog from "../models/blog.js";

export const createTestUser = async (userTest) => {

    const createdUser = new User({
        username: userTest.username,
        name: userTest.name,
        passwordHash: userTest.password, // Aquí deberías hashear la contraseña si es necesario
    });
    await createdUser.save();

    const userForToken = {
        username: createdUser.username,
        id: createdUser._id,
    };

    const token = jwt.sign(userForToken, process.env.SECRET);
    return {
        token, id: createdUser._id
    }; // Retornamos el token y el ID del usuario creado
}


export const creatBlogForUser = async (userId, blogData) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new Error("User not found");
    }
    console.log("User found for blog creation:", user);

    const blog = new Blog({
        ...blogData,
        user: user._id,
    });
    await blog.save();
    user.blogs = user.blogs.concat(blog._id);
    await user.save();
    console.log("Blog created for user:", blog);

    const blogJson = blog.toJSON();
    console.log("Blog JSON to return:", blogJson);
    return blogJson;
}