const { describe, test, after, beforeEach } = require("node:test");
const assert = require("node:assert");
const supertest = require("supertest");
const mongoose = require("mongoose");

const app = require("../app.js");
const api = supertest(app);
const User = require("../models/user");
const testDataHelper = require("./helpers/test_data_helper.js");

beforeEach(async () => {
  await User.deleteMany({}); 

  for (const user of testDataHelper.users) {
    const userObject = new User(user);
    await userObject.save();
  }
});
describe("API de usuarios", () => {
  test("obtiene todos los usuarios", async () => {
    await api
      .get("/api/users")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("Usuario no valido", async () => {
    const usersAtStart = await testDataHelper.getUsersFromDatabase();
    const userTest = {
      username: "p",
      name: "palau",
      password: "franco",
    };
    const response = await api
      .post("/api/users")
      .send(userTest)
      .expect(400)
      .expect("Content-Type", /application\/json/);
    // hago la comparacion

    console.log("body de res", response.body, response.status);
    assert(response.body.error.includes(
      "User validation failed: username: Path `username` (`p`, length 1) is shorter than the minimum allowed length (3)."  ),
    );
    const usersAtEnd = await testDataHelper.getUsersFromDatabase();
    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
  });
  test("Si el username tiene espacios en blanco", async () => {
    const userTest = {
      username: "bl op",
      name: "ma",
      password: "test",
    };

    const response = await api.post("/api/users").send(userTest);
    console.log(response.body, response.status);
  });
});
after(async () => {
  mongoose.connection.close();
});
