const test = require("node:test");
const assert = require("node:assert");
const middleware = require("../utils/middleware"); // Ajusta la ruta según tu proyecto

test("extrae el token del header Authorization", () => {
  const req = {
    get: (headerName) => {
      if (headerName.toLowerCase() === "authorization") {
        return "Bearer eyJhbGciOiJIUzI1NiIsInR5cci6IkpXVCJ9.testtoken";
      }
      return null;
    },
  };
  const res = {};
  let nextCalled = false;
  const next = () => {
    nextCalled = true;
  };

  middleware.tokenExtractor(req, res, next);

  assert.strictEqual(
    req.token,
    "eyJhbGciOiJIUzI1NiIsInR5cci6IkpXVCJ9.testtoken",
  );
  assert.strictEqual(nextCalled, true);
});

test("asigna null cuando no existe el header Authorization", () => {
  const req = {
    get: () => null,
  };
  const res = {};
  let nextCalled = false;
  const next = () => {
    nextCalled = true;
  };

  middleware.tokenExtractor(req, res, next);
  assert.strictEqual(req.token, null);
  assert.strictEqual(nextCalled, true);
});
