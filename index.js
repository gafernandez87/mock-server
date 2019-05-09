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

app.listen(Constants.PORT, (err) => {
    const url = Constants.MONGO_HOST + ":" + Constants.MONGO_PORT

    MongoClient.connect(url, Constants.MONGO_DB)
    .then(database => {
        MongoClient.findAll(Constants.ENDPOINT_COLLECTION_NAME)
        .then(endpoints => {
            endpoints.forEach((endpoint) => {
                addRouteEndpoint(endpoint, routes)
            })
        })
        
    })

    console.log(`Mock server app listening on port ${Constants.PORT}!`)
})