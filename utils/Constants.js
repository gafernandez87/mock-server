const PORT = process.env.PORT || 8080
const MONGO_HOST = process.env.MONGO_HOST || "127.0.0.1"
const MONGO_PORT = process.env.MONGO_PORT || "27017"
const MONGO_USER = process.env.MONGO_USER || ""
const MONGO_PASS = process.env.MONGO_PASS || ""
const MONGO_DB = process.env.MONGO_DB || "mock-server"
const ENDPOINT_COLLECTION_NAME = "endpoints";
const MOCK_COLLECTION_NAME = "mocks";

module.exports = {
    PORT,
    MONGO_HOST,
    MONGO_PORT,
    MONGO_USER,
    MONGO_PASS,
    MONGO_DB,
    ENDPOINT_COLLECTION_NAME,
    MOCK_COLLECTION_NAME
}
