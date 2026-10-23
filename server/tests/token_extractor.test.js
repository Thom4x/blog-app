const test = require("node:test");
const assert = require("node:assert");
const middleware = require("../utils/middleware");

test("extrae el token del header Authorization", () => {
  const request = {
    get: (headerName) => {
      if (headerName.toLowerCase() === "authorization") {
        return "Bearer eyJhbGciOiJIUzI1NiIsInR5cci6IkpXVCJ9.TokenTest";
      }
      return null;
    },
  };
  const response = {};
  let nextWasCalled = false;
  const next = () => {
    nextWasCalled = true;
  };

  middleware.tokenExtractor(request, response, next);

  assert.strictEqual(request.token, "eyJhbGciOiJIUzI1NiIsInR5cci6IkpXVCJ9.TokenTest");
  assert.strictEqual(nextWasCalled, true);
});

test("asigna null cuando no existe el header Authorization", () => {
  const request = {
    get: () => null,
  };
  const response = {};
  let nextWasCalled = false;
  const next = () => {
    nextWasCalled = true;
  };

  middleware.tokenExtractor(request, response, next);

  assert.strictEqual(request.token, null);
  assert.strictEqual(nextWasCalled, true);
});
