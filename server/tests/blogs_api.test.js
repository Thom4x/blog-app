const { describe, test, after, beforeEach } = require("node:test");
const assert = require("node:assert");
const supertest = require("supertest");
const mongoose = require("mongoose");

const testDataHelper = require("./helpers/test_data_helper.js");
const userBlogHelper = require("./helpers/user_blog_helper.js");
const app = require("../app.js");

const api = supertest(app);
const Blog = require("../models/blog");
const User = require("../models/user");

let userId = null;
let token = null;

beforeEach(async () => {
  await Blog.deleteMany({}); 
  await User.deleteMany({}); 

  for (const blog of testDataHelper.blogs) {
    const blogObject = new Blog(blog);
    await blogObject.save();
  }

  const userTest = {
    username: "testuser",
    name: "Test User",
    password: "testpassword",
  };

  const createUser = await userBlogHelper.createTestUser(userTest);
  userId = createUser.id; 
  token = createUser.token; 

  
});

test("Solicitud get para obtener todos lo blogs", async () => {
  await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

test("la propiedad de identificador único debe llamarse id", async () => {
  const response = await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);

  
  assert.strictEqual(response.body[0].hasOwnProperty("id"), true);
  assert.strictEqual(response.body[0].hasOwnProperty("_id"), false);
});

test("solicitud post para blogs", async () => {

  const object = {
    title: "fasfaf patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 1243,
  };
  const response = await api
    .post("/api/blogs")
    .set('Authorization', `Bearer ${token}`) // Agregamos el token al header Authorization
    .send(object)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const blogsAtEnd = await testDataHelper.getBlogsFromDatabase();
  assert.strictEqual(blogsAtEnd.length, testDataHelper.blogs.length + 1);
});

test("si la propiedad likes falta en la solicitud, se establece en 0 por defecto", async () => {
  const blogSinLikes = {
    title: "Título de prueba sin likes",
    author: "Tomas Holguin",
    url: "http://test-url.com",
  };

  const response = await api
    .post("/api/blogs")
    .set("Authorization", `Bearer ${token}`)
    .send(blogSinLikes)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  assert.strictEqual(response.body.likes, 0);
});

test("verificar si falta title o url en la solicitud", async () => {
  const blogSinLikes = {
    author: "Tomas Holguin",
    url: "http://test-url.com",
    title: "Título de prueba sin likes",
  };

  const response = await api
    .post("/api/blogs")
    .set("Authorization", `Bearer ${token}`)
    .send(blogSinLikes)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const find = await testDataHelper.checkBlogTitleAndUrl(
    blogSinLikes.title,
    blogSinLikes.url,
  );
  assert.strictEqual(find, undefined);
});

describe("eliminacion por id y actualizacion por id", () => {
  test("eliminacion de una nota", async () => {
    const createdBlog = await userBlogHelper.createBlogForUser(
      userId,
      {
        title: "Blog de prueba para el usuario",
        url: "http://test-url.com",
        likes: 10,
        author: "Test User",
      }
    );
    
    const blogsAtStart = await testDataHelper.getBlogsFromDatabase();
    const blogToDelete = createdBlog;

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    
    const blogsAtEnd = await testDataHelper.getBlogsFromDatabase();
    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1);

  });
  test("likes can be updated", async () => {
    const blogsAtStart = await testDataHelper.getBlogsFromDatabase();
    const blogToUpdate = blogsAtStart[0];

    const updatedData = {
      likes: blogToUpdate.likes + 1,
    };

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedData)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const blogsAtEnd = await testDataHelper.getBlogsFromDatabase();
    const updatedBlog = blogsAtEnd.find((b) => b.id === blogToUpdate.id);
    assert.strictEqual(updatedBlog.likes, blogToUpdate.likes + 1);
  });
});

after(async () => {
  await mongoose.connection.close();
});
