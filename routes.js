const { Router } = require("express");
const MockController = new (require("./controllers/MockController"))();
const EndpointController = new (require("./controllers/EndpointController"))();

const routes = new Router();

routes.get("/health", (_, res) => {
  res.status(200);
  res.send("Healty");
});

routes.get("/setup", MockController.setup);

routes.get("/mocks/:mock_id", MockController.getMock);
routes.get("/mocks", MockController.getAllMocks);
routes.post("/mocks", MockController.newMock);
routes.put("/mocks/:mock_id", MockController.updateMock);
routes.delete("/mocks/:mock_id", MockController.deleteMock);
routes.get("/mocks/:mock_id/clone", MockController.cloneMock);

routes.get("/endpoints", EndpointController.getAllEndpoints);
routes.get(
  "/mocks/:mock_id/endpoints",
  EndpointController.getAllEndpointsByMock
);
routes.get(
  "/mocks/:mock_id/endpoints/:endpoint_id/clone",
  EndpointController.cloneEndpoint
);
routes.post("/mocks/:mock_id/endpoints/", EndpointController.newEndpoint);
routes.put(
  "/mocks/:mock_id/endpoints/:endpoint_id",
  EndpointController.updateEndpoint
);
routes.delete(
  "/mocks/:mock_id/endpoints/:endpoint_id",
  EndpointController.deleteEndpoint
);

routes.get("/*", EndpointController.genericEndpoint);
routes.put("/*", EndpointController.genericEndpoint);
routes.post("/*", EndpointController.genericEndpoint);
routes.delete("/*", EndpointController.genericEndpoint);
routes.patch("/*", EndpointController.genericEndpoint);

module.exports = routes;
