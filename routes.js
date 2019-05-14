const { Router } = require('express')
const MockController = new (require('./controllers/MockController'))()
const EndpointController = new (require('./controllers/EndpointController'))()

const routes = new Router()

routes.get("/health", (_, res) => {
    res.status(200)
    res.send("Healty")
})

routes.get("/mocks", MockController.getAllMocks)
routes.post("/mocks", MockController.newMock)
routes.delete("/mocks/:mock_id", MockController.deleteMock)

routes.get("/endpoints", EndpointController.getAllEndpoints)
routes.get("/mocks/:mock_id/endpoints", EndpointController.getAllEndpointsByMock)
routes.post("/mocks/:mock_id/endpoints/", EndpointController.newEndpoint)
routes.put("/mocks/:mock_id/endpoints/:endpoint_id", EndpointController.updateEndpoint)
routes.delete("/mocks/:mock_id/endpoints/:endpoint_id", EndpointController.deleteEndpoint)


module.exports = routes