import express from "express";
import cors from "cors";
import { json } from "body-parser";
import Constants, { PORT } from "./utils/Constants";
import routes from "./routes";
const MongoClient = new (require("./clients/MongoClient"))();
// const { addRouteEndpoint } = require("./utils/RouteUtils");
// const mongo = require("mongodb");

const app = express();

app.use(json());
app.use(cors());
app.use("/mock-server", routes);

app.listen(PORT, (err) => {
  if (err) {
    console.error(err);
    return;
  }

  const { MONGO_HOST } = Constants;

  MongoClient.connect(MONGO_HOST, MONGO_DB).catch((err) => {
    console.error(err);
  });

  console.log(`Mock server app listening on port ${PORT}!`);
});
