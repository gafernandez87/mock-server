const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const Constants = require('./utils/Constants')
const routes  = require("./routes")
const {addRouteEndpoint} = require("./utils/RouteUtils")
const MongoClient = new (require('./clients/MongoClient'))()

const app = express()

app.use(bodyParser.json());
app.use(cors())
app.use("", routes)

app.listen(Constants.PORT, () => {
    MongoClient.connect(Constants.MONGO_URL, Constants.MONGO_DB)
    .then(database => {
        const endpointCollection = database.collection(Constants.ENDPOINT_COLLECTION_NAME)
        const endpoints = endpointCollection.find({})
        endpoints.forEach((endpoint) => {
            addRouteEndpoint(endpoint, routes)
        })
    })

    console.log(`Mock server app listening on port ${Constants.PORT}!`)
})