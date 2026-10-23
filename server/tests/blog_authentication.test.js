const mongoose = require("mongoose");
const supertest = require("supertest");
const { describe, test, after, beforeEach } = require("node:test");
const assert = require("node:assert");
const app = require("../app");
const api = supertest(app);
const Blog = require("../models/blog");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

describe("creación de blogs con autenticación", () => {
  let token = null;

  beforeEach(async () => {
    await Blog.deleteMany({});
    await User.deleteMany({});

    const testPasswordHash = "somehashedpassword";
    const testUser = new User({
      username: "testuser",
      name: "Test User",
      passwordHash: testPasswordHash,
    });
    const savedUser = await testUser.save();
    
    const tokenPayload = {
      username: savedUser.username,
      id: savedUser._id,
    };
    token = jwt.sign(tokenPayload, process.env.SECRET);
  });

  test("crea un blog cuando el token de autorización es válido", async () => {
    const blogToCreate = {
      title: "Prueba de token middleware",
      author: "Desarrollador",
      url: "https://ejemplo.com/middleware",
      likes: 5,
    };
    await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(blogToCreate)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const blogsInDatabase = await Blog.find({});
    assert.strictEqual(blogsInDatabase.length, 1);
    assert.strictEqual(blogsInDatabase[0].title, blogToCreate.title);
  });

  test("rechaza la creación de un blog cuando no se proporciona un token", async () => {
    const blogWithoutToken = {
      title: "Blog sin token",
      author: "Anónimo",
      url: "https://ejemplo.com/sin-token",
      likes: 0,
    };
    await api
      .post("/api/blogs") 
      .send(blogWithoutToken)
      .expect(401); 

    const blogsInDatabase = await Blog.find({});
    assert.strictEqual(blogsInDatabase.length, 0);
  });
  after(async () => {
    await mongoose.connection.close();
  });
});
