const jwt = require("jsonwebtoken");
const User = require("../../models/user");
const Blog = require("../../models/blog");

const createTestUser = async ({ username, name, password }) => {
  const createdUser = await User.create({
    username,
    name,
    passwordHash: password,
  });

  const token = jwt.sign(
    {
      username: createdUser.username,
      id: createdUser._id.toString(),
    },
    process.env.SECRET,
  );

  return {
    id: createdUser._id.toString(),
    token,
  };
};

const createBlogForUser = async (userId, blogData) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error(`User ${userId} not found`);
  }

  const blog = await Blog.create({
    ...blogData,
    user: user._id,
  });

  user.blogs = user.blogs.concat(blog._id);
  await user.save();

  return blog.toJSON();
};

module.exports = {
  createTestUser,
  createBlogForUser,
};
