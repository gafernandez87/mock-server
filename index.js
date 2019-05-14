const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const Constants = require('./utils/Constants')
const routes  = require("./routes")
const {addRouteEndpoint} = require("./utils/RouteUtils")
const MongoClient = new (require('./clients/MongoClient'))()
const mongo = require('mongodb')

const app = express()

app.use(bodyParser.json());
app.use(cors())
app.use("", routes)

app.listen(Constants.PORT, (err) => {
    const url = `mongodb://${Constants.MONGO_USER}:${Constants.MONGO_PASS}@${Constants.MONGO_HOST}:${Constants.MONGO_PORT}`

    MongoClient.connect(url, Constants.MONGO_DB)
    .then(_ => {
        MongoClient.findAll(Constants.ENDPOINT_COLLECTION_NAME)
        .then(endpoints => {
            endpoints.forEach((endpoint) => {
                const queryMock = {
                    "_id": mongo.ObjectId(endpoint.mock_id)
                }
                var pathPrefix = "";
                MongoClient.find(Constants.MOCK_COLLECTION_NAME, queryMock).then(mocks => {
                    console.log("PRE:" + mocks[0].prefix);
                    pathPrefix = mocks[0].prefix;
                    addRouteEndpoint(endpoint, pathPrefix)
                })
                .catch(err => {
                    console.error(err)
                })
            })
        })
        
    })

    console.log(`Mock server app listening on port ${Constants.PORT}!`)
})