const Constants = require('../utils/Constants')
const MongoClient = new (require('../clients/MongoClient'))()
const mongo = require('mongodb')

module.exports = class MockController {
    
    getAllMocks(_, res) {
        MongoClient.findAll(Constants.MOCK_COLLECTION_NAME)
        .then(mocks => {
            res.status(200)
            res.type("application/json")
            res.send(mocks)
        })
        .catch(err => {
            res.status(500)
            res.type("application/json")
            res.send(`{"status": 500, "message": "An exception occurred while getting all mocks", "details":${err} }`)
        })
    }

    setup(_, res){
        MongoClient.insert(Constants.MOCK_COLLECTION_NAME, {
            name: "Mock test",
            country: "AR",
            product: "MANGO",
            author: "Gaston Fernandez",
            description: "asdasdads",
            prefix: "/success"
        })
        .then(mock => {
            console.log(mock.insertedId)
            return MongoClient.insert(Constants.ENDPOINT_COLLECTION_NAME, {
                mock_id: `mock.insertedId`,
                name: "Test endpoint",
                author: "Gaston Fernandez",
                httpRequest: {
                    path: "/api/v1/users",
                    prefix: "/error",
                    method: "GET"
                },
                httpResponse: {
                    status_code: "200",
                    body: {
                        "name": "Gaston"
                    }
                }
            })
        })
        .then(a => {
            res.status(200)
            res.send("DONE")
        })
    }

    getMocks(_, res) {
        const { mock_id } = req.params
        const query = {_id: mongo.ObjectId(mock_id)}

        MongoClient.find(Constants.MOCK_COLLECTION_NAME, query)
        .then(mocks => {
            if(mocks.length == 0){
                res.status(404)
                res.type("application/json")
                res.send(`{"status": 404, "message": "Mock ${mock_id} not found"}`)
            }
            res.status(200)
            res.type("application/json")
            res.send(mocks)
        })
        .catch(err => {
            res.status(500)
            res.type("application/json")
            res.send(`{"status": 500, "message": "An exception occurred while getting mock ${mock_id}", "details":${err} }`)
        })
    }

    newMock(req, res){
        const { name, brand, product, author, description, prefix } = req.body

        if(!prefix){
            res.status(400)
            res.type("application/json")
            res.send(`{"status": 400, "message": "Prefix cannot be null or empty"}`)
        }

        MongoClient.insert(Constants.MOCK_COLLECTION_NAME, {
            name,
            brand,
            product,
            author,
            description,
            prefix
        })
        .then(data => {
            res.status(201)
            res.type("application/json")
            res.send(`{"_id": "${data.insertedId}"}`)
        })
        .catch(err => {
            res.status(500)
            res.type("application/json")
            res.send(`{"status": 500, "message": "An exception occurred while creating a new mock", "details":${err} }`)
        })
    }

    updateMock(){
        //TODO
    }

    deleteMock(req, res){
        const { mock_id } = req.params
        const query = {_id: mongo.ObjectId(mock_id)}

        MongoClient.delete(Constants.MOCK_COLLECTION_NAME, query)
        .then(data => {
            if(data.result.n == 1){
                res.status(200)
                res.type("application/json")
                res.send(`{"status": 200, "message": "Mock ${mock_id} deleted"}`)
            }else{
                console.error(`{"status": 500, "message": "An error occurred while deleting Mock ${mock_id}"}`)
                res.status(500)
                res.type("application/json")
                res.send(`{"status": 500, "message": "An error occurred while deleting Mock ${mock_id}"}`)
            }
            
        }).catch(err => {
            console.error(`Error deleting Mock ${mock_id}`, err)
            res.status(500)
            res.type("application/json")
            res.send(`{"status": 500, "message": "An error occurred while deleting Mock ${mock_id}", "details": ${err}}`)
        })
    }

    cloneMock(req, res){
        const { mock_id } = req.params
        const mockQuery = {_id: mongo.ObjectId(mock_id)}
        const endpointQuery = {mock_id: mock_id}


        const mockPromise = new Promise(function(resolve, reject) {
            MongoClient.find(Constants.MOCK_COLLECTION_NAME, mockQuery)
            .then(mocks => {
                if(mocks.length == 0){
                    reject("mock not found")
                }else{                
                    resolve(mocks[0])
                }
            })
        })

        const endpointPromise = new Promise(function(resolve, reject) {
            MongoClient.find(Constants.ENDPOINT_COLLECTION_NAME, endpointQuery)
            .then(endpoints => {
                if(endpoints.length == 0){
                    reject("endpoints not found")
                }else{                
                    resolve(endpoints)
                }
            })
        })

        Promise.all([mockPromise, endpointPromise])
        .then(data => {
            const mock = {...data[0]}
            const endpointList = [...data[1]]

            MongoClient.insert(Constants.MOCK_COLLECTION_NAME, {
                name: `(Copy) ${mock.name}`,
                brand: mock.brand,
                product: mock.product,
                author: mock.author,
                description: mock.description,
                prefix: `/copy${mock.prefix}`
            })
            .then(newMock => {
                console.log(endpointList)
                const newEndpointIdList = endpointList.map(endpoint =>{
                    return MongoClient.insert(Constants.ENDPOINT_COLLECTION_NAME, {
                        mock_id: newMock.insertedId, 
                        name: `(Copy) ${endpoint.name}`,
                        author: endpoint.author,
                        httpRequest: {...endpoint.httpRequest},
                        httpResponse: {...endpoint.httpResponse}
                    })
                    .then(newEndpoint => {
                        return newEndpoint.insertedId
                    })
                })
                const obj = {
                    "mock_id": newMock.insertedId,
                    "endpoint_id_list": newEndpointIdList
                }
                res.type("application/json")
                res.send(obj)
    
            })
        })
        .catch(err => {
            res.type("application/json")
            res.send(`Error ${err}`)
        })

    }

}