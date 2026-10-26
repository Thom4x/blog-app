const path = require("path");
require("dotenv").config({
  path: path.join(__dirname, "..", ".env"),
});

const isTestEnvironment = process.env.NODE_ENV === "test";
const PORT = process.env.PORT || 3003;
const MONGODB_URI = isTestEnvironment
  ? process.env.TEST_MONGODB_URI
  : process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    `${isTestEnvironment ? "TEST_MONGODB_URI" : "MONGODB_URI"} must be configured`,
  );
}

if (
  isTestEnvironment &&
  process.env.MONGODB_URI &&
  MONGODB_URI === process.env.MONGODB_URI
) {
  throw new Error("TEST_MONGODB_URI must be different from MONGODB_URI");
}

module.exports = {
  MONGODB_URI,
  PORT,
};
