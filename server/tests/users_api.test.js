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
    const userDocument = new User(user);
    await userDocument.save();
  }
});

describe("API de usuarios", () => {
  test("obtiene todos los usuarios", async () => {
    await api
      .get("/api/users")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("rechaza un usuario con un nombre de usuario demasiado corto", async () => {
    const usersAtStart = await testDataHelper.getUsersFromDatabase();
    const invalidUser = {
      username: "p",
      name: "palau",
      password: "franco",
    };
    const response = await api
      .post("/api/users")
      .send(invalidUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);
    assert(response.body.error.includes(
      "User validation failed: username: Path `username` (`p`, length 1) is shorter than the minimum allowed length (3)."  ),
    );
    const usersAtEnd = await testDataHelper.getUsersFromDatabase();
    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
  });
  test("procesa un nombre de usuario que contiene espacios", async () => {
    const userWithSpaces = {
      username: "bl op",
      name: "ma",
      password: "test",
    };

    await api.post("/api/users").send(userWithSpaces);
  });
});
after(async () => {
  await mongoose.connection.close();
});
