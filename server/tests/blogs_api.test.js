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

let authenticatedUserId = null;
let authenticationToken = null;

beforeEach(async () => {
  await Blog.deleteMany({});
  await User.deleteMany({});

  for (const blog of testDataHelper.blogs) {
    const blogDocument = new Blog(blog);
    await blogDocument.save();
  }

  const testUser = {
    username: "testuser",
    name: "Test User",
    password: "testpassword",
  };

  const createdUser = await userBlogHelper.createTestUser(testUser);
  authenticatedUserId = createdUser.id;
  authenticationToken = createdUser.token;
});

test("obtiene todos los blogs", async () => {
  await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

test("expone el identificador como id y no como _id", async () => {
  const response = await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);

  
  assert.strictEqual(response.body[0].hasOwnProperty("id"), true);
  assert.strictEqual(response.body[0].hasOwnProperty("_id"), false);
});

test("crea un blog con los datos proporcionados", async () => {
  const blogToCreate = {
    title: "fasfaf patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 1243,
  };
  const response = await api
    .post("/api/blogs")
    .set('Authorization', `Bearer ${authenticationToken}`) // Agregamos el token al header Authorization
    .send(blogToCreate)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const blogsAtEnd = await testDataHelper.getBlogsFromDatabase();
  assert.strictEqual(blogsAtEnd.length, testDataHelper.blogs.length + 1);
});

test("asigna cero likes cuando la solicitud no incluye likes", async () => {
  const blogWithoutLikes = {
    title: "Título de prueba sin likes",
    author: "Tomas Holguin",
    url: "http://test-url.com",
  };

  const response = await api
    .post("/api/blogs")
    .set("Authorization", `Bearer ${authenticationToken}`)
    .send(blogWithoutLikes)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  assert.strictEqual(response.body.likes, 0);
});

test("valida los datos requeridos del blog", async () => {
  const blogWithRequiredData = {
    author: "Tomas Holguin",
    url: "http://test-url.com",
    title: "Título de prueba sin likes",
  };

  const response = await api
    .post("/api/blogs")
    .set("Authorization", `Bearer ${authenticationToken}`)
    .send(blogWithRequiredData)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const find = await testDataHelper.checkBlogTitleAndUrl(
    blogWithRequiredData.title,
    blogWithRequiredData.url,
  );
  assert.strictEqual(find, undefined);
});

describe("operaciones de actualización y eliminación de blogs", () => {
  test("elimina un blog por su identificador", async () => {
    const createdBlog = await userBlogHelper.createBlogForUser(
      authenticatedUserId,
      {
        title: "Blog de prueba para el usuario",
        url: "http://test-url.com",
        likes: 10,
        author: "Test User",
      }
    );
    
    const blogsBeforeDeletion = await testDataHelper.getBlogsFromDatabase();
    const blogToDelete = createdBlog;

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set("Authorization", `Bearer ${authenticationToken}`)
      .expect(200);

    
    const blogsAtEnd = await testDataHelper.getBlogsFromDatabase();
    assert.strictEqual(blogsAtEnd.length, blogsBeforeDeletion.length - 1);

  });
  test("actualiza la cantidad de likes de un blog", async () => {
    const blogsBeforeUpdate = await testDataHelper.getBlogsFromDatabase();
    const blogToUpdate = blogsBeforeUpdate[0];

    const updatedBlogData = {
      likes: blogToUpdate.likes + 1,
    };

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedBlogData)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const blogsAfterUpdate = await testDataHelper.getBlogsFromDatabase();
    const updatedBlog = blogsAfterUpdate.find(
      (blog) => blog.id === blogToUpdate.id,
    );
    assert.strictEqual(updatedBlog.likes, blogToUpdate.likes + 1);
  });
});

after(async () => {
  await mongoose.connection.close();
});
