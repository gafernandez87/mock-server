const PORT = 8000
const MONGO_HOST = process.env.MONGO_HOST || "mongodb://127.0.0.1"
const MONGO_PORT = process.env.MONGO_PORT || "27017"
const MONGO_DB = "mock-server"
const ENDPOINT_COLLECTION_NAME = "endpoints";
const MOCK_COLLECTION_NAME = "mocks";

module.exports = {
    PORT,
    MONGO_HOST,
    MONGO_PORT,
    MONGO_DB,
    ENDPOINT_COLLECTION_NAME,
    MOCK_COLLECTION_NAME
}
