const Constants = require('../utils/Constants')
const { db, find, findAll } = require('../index')

module.exports = class MockController {
    newMock(req, res){
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
    }

    getAllMocks(req, res) {
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
    }
}