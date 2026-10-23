const blogRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const { getTokenFrom } = require("../utils/middleware");

blogRouter.get("/", async (request, response) => {
  const blog = await Blog
  .find({})
  .populate("user", { username: 1, name: 1 });

  response.json(blog);
});

blogRouter.post("/:id/comments", async (request, response) => {
  try {
    const { text } = request.body;

    if (!text || text.trim() === "") {
      return response.status(400).json({ error: "comments are required" });
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      request.params.id,
      { $push: { comments: { text } } },
      { new: true, runValidators: true }
    );

    if (!updatedBlog) {
      return response.status(404).json({ error: "blog not found" });
    }

    response.json(updatedBlog);
  } catch (error) {
    console.error("Error al guardar comentario:", error.message);
    response.status(400).json({ error: "malformatted id or request error" });
  }
});

blogRouter.post("/", async (request, response) => {
  const body = request.body;

  const decodedToken = jwt.verify(request.token, process.env.SECRET);
  if (!decodedToken.id) {
    return response.status(401).json({ error: "token invalid" });
  }

  const user = await User.findById(decodedToken.id);

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user._id,
  });

  let savedBlog = await blog.save(); 
  savedBlog = await savedBlog.populate("user", { username: 1, name: 1 });

  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();

  response.status(201).json(savedBlog);
});

blogRouter.delete("/:id", async (request, response) => {

  const decodedToken = jwt.verify(request.token, process.env.SECRET);
  if (!decodedToken.id) {
    return response.status(401).json({ error: "token invalid" });
  }
  const blog = await Blog.findById(request.params.id);
  if (!blog) {
    return response.status(404).json({ error: "blog not found" });
  }

  if (blog.user.toString() !== decodedToken.id.toString()) {
    return response
      .status(403)
      .json({ error: "only the creator can delete a blog" });
  }

  await Blog.findByIdAndDelete(request.params.id);
  response.json({ message: "blog deleted successfully" }).status(200).end();
});

blogRouter.put("/:id", async (request, response) => {
  const { likes } = request.body;

  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    { likes },
    { new: true, runValidators: true, context: "query" },
  ).populate("user", { username: 1, name: 1 });

  console.log("Updated blog:", updatedBlog);

  if (updatedBlog) {
    response.json(updatedBlog);
  } else {
    response.status(404).end();
  }
});



module.exports = blogRouter;
