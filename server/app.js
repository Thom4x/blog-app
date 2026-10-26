const config = require("./utils/config.js");
const express = require("express");
const path = require("path");
const app = express();
const cors = require("cors");
const blogRouter = require("./controllers/blogs.js");
const userRouter = require("./controllers/users.js");
const loginRouter = require("./controllers/login.js");
const middleware = require("./utils/middleware.js");
const logger = require("./utils/logger.js");
const mongoose = require("mongoose");
const fs = require("fs");
mongoose.set("strictQuery", false);

logger.info("connecting to", config.MONGODB_URI);

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info("connected to MongoDB");
  })
  .catch((error) => {
    logger.error("error connecting to MongoDBs:", error.message);
  });

app.use(cors());
app.use(express.json());
app.use(middleware.requestLogger);

app.use(
  "/api/blogs",
  middleware.tokenExtractor,
  middleware.userExtractor,
  blogRouter,
);
app.use("/api/users", userRouter);
app.use("/api/login", loginRouter);
app.get("/api/ping", (request, response) => {
  response.json({ message: "pong", time: new Date().toISOString() });
});

if (process.env.NODE_ENV === "test") {
  const testingRouter = require("./controllers/testing.js");
  app.use("/api/testing", testingRouter);
}

const frontendPath = path.join(__dirname, "../client/dist");
const hasFrontendBuild = fs.existsSync(frontendPath);

if (process.env.NODE_ENV === "production" && !hasFrontendBuild) {
  throw new Error("Frontend build not found");
}

if (process.env.NODE_ENV === "production" || hasFrontendBuild) {
  app.use(express.static(frontendPath));
  app.get("/{*splat}", (request, response, next) => {
    if (request.path.startsWith("/api/")) {
      return next();
    }

    return response.sendFile(path.join(frontendPath, "index.html"));
  });
}

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
