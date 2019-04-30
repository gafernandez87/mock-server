import {Request, Response} from 'express'

export class EndpointController {
    newEndpoint = (req, res) => {
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
}