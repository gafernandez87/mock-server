const mongo = require('mongodb')
const Constants = require('../utils/Constants')
const MongoClient = new (require('../clients/MongoClient'))()

module.exports = class EndpointController {
    
    getAllEndpoints(_, res){
        console.log("getting all endpoints")
        MongoClient.findAll(Constants.ENDPOINT_COLLECTION_NAME)
        .then(endpoints => {
            res.status(200)
            res.type("application/json")
            res.send(endpoints)
        })
        .catch(err => {
            res.status(500)
            res.send(`Error ${err}`)
        })
    }

    getAllEndpointsByMock(req, res){
        const query = {
            mock_id: req.params.mock_id
        }

        console.log(`getting endpoints from mock ${req.params.mock_id}`)

        MongoClient.find(Constants.ENDPOINT_COLLECTION_NAME, query)
        .then(endpoints => {
            res.status(200)
            res.type("application/json")
            res.send(endpoints)
        })
        .catch(err => {
            res.status(500)
            res.send(`Error ${err}`)
        })
    }
    
    newEndpoint(req, res) {
        const { httpRequest, httpResponse, name, author } = req.body

        console.log("new endpoint", req.body)
        const query = {
            "httpRequest.path": httpRequest.path,
            "httpRequest.method": httpRequest.method
        }

        MongoClient.find(Constants.ENDPOINT_COLLECTION_NAME, query)
        .then(items => {
            if(items.length > 0){
                res.status("400")
                res.type('application/json')
                res.send(`{"error": "El path ${httpRequest.path} ya existe"}`)
            }else{
                MongoClient.insert(Constants.ENDPOINT_COLLECTION_NAME, 
                {
                    mock_id: req.params.mock_id, 
                    name,
                    author,
                    httpRequest, 
                    httpResponse
                })
                .then(data => {
                    const {addRouteEndpoint} = require("../utils/RouteUtils")
                    addRouteEndpoint(req.body)
                    res.status(201)
                    res.type('application/json')
                    res.send(`{"_id": "${data.insertedId}"}`)
                })
            }
        })
        .catch(err => {
            res.status(500)
            res.type('application/json')
            res.send(err)
        })
    }

    updateEndpoint(req, res){
        const { endpoint_id, mock_id } = req.params
        const query = {
            "_id": mongo.ObjectId(endpoint_id),
            "mock_id": mock_id
        }
        
        MongoClient.find(Constants.ENDPOINT_COLLECTION_NAME, query)
        .then(endpoints => {
            if(endpoints.length == 0){
                console.log(`Update endpoint error. Endpoint (id: ${endpoint_id}) not found in mocks(id: ${mock_id})"}`)
                res.status(404)
                res.type("application/json")
                res.send(`{ "status": 404, "message: "Endpoint (id: ${endpoint_id}) not found in mocks(id: ${mock_id})"}`)
            }
            if(endpoints.length > 1){
                console.log(`Update endpoint error. Found more than 1 endpoint with id ${endpoint_id} and mockid ${mock_id}`)
                res.status(400)
                res.type("application/json")
                res.send(`{ "status": 400, "message: "Found more than 1 endpoint with id ${endpoint_id} and mockid ${mock_id}"}`)
            }
    
            const {_id, ...body} = req.body
            MongoClient.update(Constants.ENDPOINT_COLLECTION_NAME, query, body)
            .then(result => {
                if(result.result.n == 1){
                    const {addOrModifyRouteEndpoint} = require("../utils/RouteUtils")
                    addOrModifyRouteEndpoint(body)

                    res.status(200)
                    res.type("application/json")
                    res.send(`{"status": 200, "message": "endpoint ${endpoint_id} updated"}`)
                }else{
                    res.status(500)
                    res.type("application/json")
                    res.send(`{"status": 500, "message": "An error occurred while updating endpoint ${endpoint_id} and mock ${mock_id}"}`)
                }
            })
            .catch(err => {
                console.error(`Error updating endpoint 1 ${endpoint_id}`, err)
                res.status(500)
                res.type("application/json")
                res.send(err)
            })
        }).catch(err => {
            console.error(`Error updating endpoint 2 ${endpoint_id}`, err)
            res.status(500)
            res.type("application/json")
            res.send(err)
        })
    }

    deleteEndpoint(req, res){
        const { endpoint_id, mock_id } = req.params
        const query = {
            "_id": mongo.ObjectId(endpoint_id),
            "mock_id": mock_id
        }
        
        MongoClient.delete(Constants.ENDPOINT_COLLECTION_NAME, query)
        .then(result => {
            if(result.result.n == 1){
                res.status(200)
                res.type("application/json")
                res.send(`{"status": 200, "message": "Endpoint ${endpoint_id} deleted"}`)
            }else{
                console.error(`{"status": 500, "message": "An error occurred while deleting endpoint ${endpoint_id}"`)
                res.status(500)
                res.type("application/json")
                res.send(`{"status": 500, "message": "An error occurred while deleting endpoint ${endpoint_id}"}`)
            }
            
        }).catch(err => {
            console.error(`Error deleting endpoint ${endpoint_id}`, err)
            res.status(500)
            res.type("application/json")
            res.send(err)
        })
    }
}