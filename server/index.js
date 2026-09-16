const express = require("express");
const path = require("path");
const app = require("./app.js");
const logger = require("./utils/logger.js");
const config = require("./utils/config.js");

app.use(express.json());

app.get("/api/ping", (req, res) => {
  res.json({ message: "pong", time: new Date().toISOString() });
});

// serve the built Vite frontend in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/dist")));
  app.get("/*splat", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/dist/index.html"));
  });
}

app.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`);
});
