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
app.use("/mock-server", routes)

app.listen(Constants.PORT, (err) => {
    const { MONGO_HOST, MONGO_USER,MONGO_PASS,MONGO_DB} = Constants
    const url = `mongodb://${MONGO_USER}:${MONGO_PASS}@${MONGO_HOST}`

    MongoClient.connect(url, MONGO_DB)
    .then(_ => {
        console.log("Mongo connection successfully.")
        return MongoClient.findAll(Constants.ENDPOINT_COLLECTION_NAME)
    })
    .then(endpoints => {
        endpoints.forEach((endpoint) => {
            const queryMock = {
                "_id": mongo.ObjectId(endpoint.mock_id)
            }
            var pathPrefix = "";
            MongoClient.find(Constants.MOCK_COLLECTION_NAME, queryMock).then(mocks => {
                pathPrefix = mocks[0] ? mocks[0].prefix : "";
                addRouteEndpoint(endpoint, pathPrefix)
            })
            .catch(err => {
                console.error(err)
            })
        })
    })
    .catch(err => {
        console.error(err)        
    })

    console.log(`Mock server app listening on port ${Constants.PORT}!`)
})