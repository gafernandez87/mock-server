const Constants = require('../utils/Constants')
const MongoClient = new (require('../clients/MongoClient'))()

module.exports = class MockController {
    
    getAllMocks(_, res) {
        console.log("getting all mocks")
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
        const { name, brand, product, author, description } = req.body
    
        collection.insertOne({
            name,
            brand,
            product,
            author,
            description,
            creation_date: new Date().toISOString(),
            last_update: new Date().toISOString()
        })
        .then(data => {
            res.status(201)
            res.send(data.insertedId)
        })
        .catch(err => {
            res.status(500)
            res.send(err)
        })
    }

    updateMock(){

    }

    deleteMock(){

    }
}