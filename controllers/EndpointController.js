const mongo = require('mongodb')
const Constants = require('../utils/Constants')
const MongoClient = new (require('../clients/MongoClient'))()
const js2xmlparser = require("js2xmlparser");

module.exports = class EndpointController {
    
    genericEndpoint(req, res){
        //Separo el prefix del path
        let prefix, path = ""
        req.path.split("/").forEach((e, i) => {
            if(i == 1){
                prefix = `/${e}`
            }else if(i > 0){
                path+= `/${e}`
            }
        })

        const query = {
            "httpRequest.prefix": prefix,
            "httpRequest.path": path,
            "httpRequest.method": req.method.toUpperCase()
        }
        console.log(query)
        MongoClient.find(Constants.ENDPOINT_COLLECTION_NAME, query)
        .then(data => {
            if(data.length == 0){
                console.log("Not found")
                res.status(404)
                res.send(`{"error": "El path ${req.method.toUpperCase()} ${req.path} no existe"}`)
            }else if(data.length == 1){
                const endpoint = data[0]
                const {headers} = endpoint.httpResponse

                //Seteo los headers
                let isXml = false
                if(headers) {
                    let keys = Object.keys(headers)
                    keys.forEach(key => {
                        if(headers[key].indexOf("xml") != -1){
                            isXml = true
                        }
                        res.set(key, headers[key])
                    })
                }

                //Seteo status code
                res.status(endpoint.httpResponse.status_code)
                const body = endpoint.httpResponse.body
                if(body){
                    if(isXml){
                        const bodyXml = js2xmlparser.parse("body", sanitizeJson(body))
                        res.send(bodyXml)
                    }else{
                        res.send(body)
                    }
                }else{
                    res.send("{}")
                }
            }else{
                res.status(500)
                res.send(`{"error": "More than 1 endpoint found with the same path"}`)
            }
        })
        .catch(err => {
            res.status(500)
            res.type("application/json")
            res.send(err)
        })
    }

    getAllEndpoints(_, res){
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
            console.log(query)
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
        const mockId = req.params.mock_id
        httpRequest.method = httpRequest.method.toUpperCase()

        getPrefix(mockId)
        .then(prefix => {
            httpRequest.prefix = prefix
            const query = {
                "httpRequest.prefix": prefix,
                "httpRequest.path": httpRequest.path,
                "httpRequest.method": httpRequest.method
            }
    
            console.log(query)
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
                        res.status(201)
                        res.type('application/json')
                        res.send(`{"_id": "${data.insertedId}"}`)
                    })
                }
            })
            
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
                res.send(`{ "status": 404, "message": "Endpoint (id: ${endpoint_id}) not found in mocks(id: ${mock_id})"}`)
            }
            if(endpoints.length > 1){
                console.log(`Update endpoint error. Found more than 1 endpoint with id ${endpoint_id} and mockid ${mock_id}`)
                res.status(400)
                res.type("application/json")
                res.send(`{ "status": 400, "message": "Found more than 1 endpoint with id ${endpoint_id} and mockid ${mock_id}"}`)
            }
    
            const {_id, ...body} = req.body
            MongoClient.update(Constants.ENDPOINT_COLLECTION_NAME, query, body)
            .then(result => {
                if(result.result.n == 1){
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
                res.send(`{"status": 500, "message": "Error updating endpoint_1"}`)
            })
        }).catch(err => {
            console.error(`Error updating endpoint 2 ${endpoint_id}`, err)
            res.status(500)
            res.type("application/json")
            res.send(`{"status": 500, "message": "Error updating endpoint_2 "}`)
        })
    }

    deleteEndpoint(req, res){
        const { endpoint_id, mock_id } = req.params
        const query = {
            "_id": mongo.ObjectId(endpoint_id),
            "mock_id": mock_id
        }
        
        MongoClient.deleteOne(Constants.ENDPOINT_COLLECTION_NAME, query)
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

function getPrefix(mockId){
    return new Promise(function(resolve, reject) {
        const queryMock = {
            "_id": mongo.ObjectId(mockId)
        }
        console.log(queryMock)
        MongoClient.find(Constants.MOCK_COLLECTION_NAME, queryMock)
        .then(mocks => {
            resolve(mocks[0] && mocks[0].prefix)
        }).catch(err => {
            reject(err)
        })
    }) 
}

function sanitizeJson(body){

    const newBody = Object.keys(body).reduce((acc, current) => {
        acc[current.trim().replace(new RegExp(" ", 'g'), "_")] = body[current]
        return acc
    }, {})

    return newBody
}