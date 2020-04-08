const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const Constants = require("./utils/Constants");
const routes = require("./routes");
const MongoClient = new (require("./clients/MongoClient"))();
// const { addRouteEndpoint } = require("./utils/RouteUtils");
// const mongo = require("mongodb");

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use("/mock-server", routes);

app.listen(Constants.PORT, (err) => {
  if (err) {
    console.error(err);
    return;
  }

  const { MONGO_HOST } = Constants;

  MongoClient.connect(MONGO_HOST, MONGO_DB).catch((err) => {
    console.error(err);
  });

  console.log(`Mock server app listening on port ${Constants.PORT}!`);
});
