const bcrypt = require("bcrypt");
const userRouter = require("express").Router();
const User = require("../models/user");

userRouter.get("/", async (request, response) => {
  const getUser = await User.find({}).populate("blogs", {
    url: 1,
    title: 1,
    author: 1,
  });
  response.json(getUser);
});

userRouter.post("/", async (request, response) => {
  const { username, name, password } = request.body;

  if (!username || !password) {
    return response.status(400).json({ error: "invalid username or password" });
  }

  if (
    (username.length < 3 && username.trim() === "") ||
    (password.length < 3 && password.trim() === "")
  ) {
    return response.status(422).json({
      error: "username and password must be at least 3 characters long",
    });
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({
    username,
    name,
    passwordHash,
  });

  const savedUser = await user.save();
  response.status(201).json(savedUser);
});

userRouter.put("/:id/comments", async (request, response) => {
  const { comments } = request.body;

  // Update the likes of the blog with the given ID
  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    { comments },
    { new: true, runValidators: true, context: "query" },
  ).populate("user", { username: 1, name: 1 });

  console.log("Updated blog:", updatedBlog);

  if (updatedBlog) {
    response.json(updatedBlog);
  } else {
    response.status(404).end();
  }
});

module.exports = userRouter;
