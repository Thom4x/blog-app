const mongoose = require("mongoose");
const supertest = require("supertest");
const { describe, test, after, beforeEach } = require("node:test");
const assert = require("node:assert");
const app = require("../app"); // Tu aplicación Express
const api = supertest(app);
const Blog = require("../models/blog");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

describe("creación de blogs con autenticación", () => {
  let token = null;

  beforeEach(async () => {
    await Blog.deleteMany({});
    await User.deleteMany({});

    const passwordHash = "somehashedpassword"; 
    const testUser = new User({
      username: "testuser",
      name: "Test User",
      passwordHash: passwordHash,
    });
    const savedUser = await testUser.save();
    
    const userForToken = {
      username: savedUser.username,
      id: savedUser._id,
    };
    token = jwt.sign(userForToken, process.env.SECRET);
  });

  test("un blog válido puede ser añadido con un token válido en el header Authorization", async () => {
    const myToken = token;
    const newBlog = {
      title: "Prueba de token middleware",
      author: "Desarrollador",
      url: "https://ejemplo.com/middleware",
      likes: 5,
    };
    console.log("Token en el test:", myToken);
    await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${myToken}`)
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const blogsAtEnd = await Blog.find({});
    console.log("Blogs en la base de datos después de la prueba:", blogsAtEnd);
    assert.strictEqual(blogsAtEnd.length, 1); 
    assert.strictEqual(blogsAtEnd[0].title, "Prueba de token middleware");
  });

  test("falla con el código 401 si no se provee un token", async () => {
    const newBlog = {
      title: "Blog sin token",
      author: "Anónimo",
      url: "https://ejemplo.com/sin-token",
      likes: 0,
    };
    await api
      .post("/api/blogs") 
      .send(newBlog)
      .expect(401); 

    const blogsAtEnd = await Blog.find({});
    assert.strictEqual(blogsAtEnd.length, 0);
  });
  after(async () => {
    await mongoose.connection.close();
  });
});
