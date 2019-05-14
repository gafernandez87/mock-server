const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const Constants = require('./utils/Constants')
const routes  = require("./routes")
const {addRouteEndpoint} = require("./utils/RouteUtils")
const MongoClient = new (require('./clients/MongoClient'))()
const mongo = require('mongodb')
const axios = require('axios')

const app = express()

app.use(bodyParser.json());
app.use(cors())
app.use("", routes)

app.listen(Constants.PORT, (err) => {

    console.log("================================")
    console.log("PROCESS ENV DATA", process.env.data)
    console.log("MONGO_USER", process.env.data["MONGO_USER"])
    console.log("typeof", typeof process.env.data)
    console.log("================================")

    const MONGO_USER = process.env.data.MONGO_USER
    const MONGO_PASS = process.env.data.MONGO_PASS
    const MONGO_HOST = process.env.data.MONGO_HOST
    const MONGO_DB = process.env.data.MONGO_DB

    const url = `mongodb://${MONGO_USER}:${MONGO_PASS}@${MONGO_HOST}:27017`

    console.log("connecting to mongo", url)
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
                //  console.log("PRE:" + mocks[0].prefix);
                pathPrefix = mocks[0].prefix;
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