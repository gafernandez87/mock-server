const Constants = require('../utils/Constants')
const MongoClient = new (require('../clients/MongoClient'))()
const mongo = require('mongodb')

module.exports = class MockController {
    
    getAllMocks(_, res) {
        MongoClient.findAll(Constants.MOCK_COLLECTION_NAME).then(mocks => {
            res.status(200)
            res.type("application/json")
            res.send(mocks)
        })
        .catch(err => {
            res.status(500)
            res.send("Error")
        })
    }

    newMock(req, res){
        const collection = db.collection("mocks")
        const { name, brand, product, author, description, prefix } = req.body
    
        collection.insertOne({
            name,
            brand,
            product,
            author,
            description,
            prefix,
            creation_date: new Date().toISOString(),
            last_update: new Date().toISOString()
        })
        .then(data => {
            res.status(201)
            res.type("application/json")
            res.send(`{"_id": "${data.insertedId}"}`)
        })
        .catch(err => {
            res.status(500)
            res.send(err)
        })
    }

    updateMock(){

    }

    deleteMock(req, res){
        const { mock_id } = req.params
        const query = {_id: mongo.ObjectId(mock_id)}

        MongoClient.delete(Constants.MOCK_COLLECTION_NAME, query)
        .then(data => {
            console.log(data)
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
            res.send(err)
        })
    }
}