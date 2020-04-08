const PORT = process.env.PORT || 8080;
const MONGO_HOST = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017";
const MONGO_DB = process.env.MONGO_DB || "mock-server";
const ENDPOINT_COLLECTION_NAME = "endpoints";
const MOCK_COLLECTION_NAME = "mocks";

module.exports = {
  PORT,
  MONGO_HOST,
  MONGO_DB,
  ENDPOINT_COLLECTION_NAME,
  MOCK_COLLECTION_NAME,
};
