
const express = require('express')
const MongoClient = require('mongodb').MongoClient
const bodyParser = require('body-parser')
const MockController = require('./controllers/MockController')
const Constants = require('./utils/Constants')
const app = express()

app.use(bodyParser.json());

var db;

app.get("/healthCheck", (_, res) => {
    res.send("Healty")
})  

app.get("/mocks", (req, res) => {
    findAll(Constants.MOCK_COLLECTION_NAME).then(mocks => {
        res.status(200)
        res.header("Access-Control-Allow-Origin", "*"); //CORS
        res.type("application/json")
        res.send(mocks)
    })
    .catch(err => {
        res.status(500)
        res.send("Error")
    })
})

app.get("/endpoints", (req, res) => {
    findAll(Constants.ENDPOINT_COLLECTION_NAME).then(endpoints => {
        res.status(200)
        res.header("Access-Control-Allow-Origin", "*"); //CORS
        res.type("application/json")
        res.send(endpoints)
    })
    .catch(err => {
        res.status(500)
        res.send(`Error ${err}`)
    })
})

app.post("/mocks", (req, res) => {
    const collection = db.collection("mocks")
    const { name, brand, product, author, description } = req.body

    collection.insertOne({
        name,
        brand,
        product,
        author,
        description,
        creation_date: new Date().toISOString()
    })
    .then(data => {
        res.status(201)
        res.send(data.insertedId)
    })
    .catch(err => {
        res.status(500)
        res.send(err)
    })
})

app.post("/mock/:mock_id/endpoints", (req, res) => {
    const { httpRequest, httpResponse, name, author } = req.body

    const query = {
        "httpRequest.path": httpRequest.path,
        "httpRequest.method": httpRequest.method
    }

    find(Constants.ENDPOINT_COLLECTION_NAME, query).then(items => {
        if(items.length > 0){
            res.status("400")
            res.type('application/json')
            res.send(`{"error": "El path ${httpRequest.path} ya existe"}`)
        }else{
            const endpointsCollection = db.collection(Constants.ENDPOINT_COLLECTION_NAME)
            endpointsCollection.insertOne({
                mock_id: req.params.mock_id, 
                name,
                author,
                httpRequest, 
                httpResponse,
                creation_date: new Date().toISOString()
            })
            .then(data => {
                addRouteEndpoint(req.body)
                res.status(201)
                res.type('application/json')
                res.send(`{"_id": "${data.insertedId}"}`)
            })
            .catch(err => {
                res.status(500)
                res.type('application/json')
                res.send(err)
            })
        }
    })    
})

app.get("/mocks/:mock_id/endpoints", (req, res) => {

    const query = {
        mock_id: req.params.mock_id
    }

    find(Constants.ENDPOINT_COLLECTION_NAME, query).then(endpoints => {
        res.status(200)
        res.header("Access-Control-Allow-Origin", "*"); //CORS
        res.type("application/json")
        res.send(endpoints)
    })
    .catch(err => {
        res.status(500)
        res.send(`Error ${err}`)
    })
})


function find(collectionName, query){
    const collection = db.collection(collectionName)
    return (new Promise(function(resolve, reject){
        collection.find(query).toArray((err, items) => {
            if(err){
                reject(err)
            }else{
                resolve(items)
            }
        })
    }))
}

function findAll(collectionName){
    return find(collectionName, {})
}

function addRouteEndpoint(request) {
    const { method, path } = request.httpRequest;
    const { body, statusCode } = request.httpResponse;

    (app.route(path)[method.toLowerCase()])( (_, res) => {
        res.header("Access-Control-Allow-Origin", "*"); //CORS

        if(statusCode){
            res.status(statusCode)
        }
        if(body){
            res.send(body)
        }else{
            res.send("")
        }
    })
}

app.listen(Constants.PORT, () => {
    MongoClient.connect(Constants.MONGO_URL)
    .then(client => {
        console.log("Connected successfully to server")
        db = client.db("mockServer")
        return db 
    })
    .then(database => {
        const endpointCollection = database.collection(Constants.ENDPOINT_COLLECTION_NAME)
        const endpoints = endpointCollection.find({})
        endpoints.forEach((endpoint) => {
            addRouteEndpoint(endpoint)
        })
    })
    .catch(err => {
        console.error(err)
    })
    console.log(`Example app listening on port ${Constants.PORT}!`)
})

/*
module.exports = {
    db,
    find: this.find,
    findAll: this.findAll
}
*/