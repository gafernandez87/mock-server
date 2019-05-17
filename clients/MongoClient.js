const mongo = require('mongodb')
const MongoConnector = mongo.MongoClient

module.exports = class MongoClient {
    connect(url, database) {
        return new Promise(function(resolve, reject) {
            MongoConnector.connect(url, { useNewUrlParser: true })
            .then(client => {
                console.log("Connected successfully to mongo")
                const db = client.db(database)
                global.db = db
                resolve(db)
            })
            .catch(err => {
                console.error("Error connectin to mongo", err)
                reject(err)
            })
        })
    }

    find(collectionName, query){
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

    findAll(collectionName){
        return this.find(collectionName, {})
    }

    insert(collectionName, body){
        const collection = db.collection(collectionName)
        return collection.insertOne({
            ...body,
            creation_date: new Date().toISOString(),
            last_update: new Date().toISOString()
        })
    }

    update(collectionName, query, body){
        const collection = db.collection(collectionName)
        return (new Promise(function(resolve, reject){
            collection.updateOne(query, { $set: body }, (err, result) => {
                if(err){
                    reject(err)
                }else{
                    resolve(result)
                }
            })
        }))
    }

    deleteMany(collectionName, query){
        const collection = db.collection(collectionName)
        return (new Promise(function(resolve, reject){
            collection.deleteMany(query, (err, result) => {
                if(err){
                    reject(err)
                }else{
                    resolve(result)
                }
            })
        }))
    }

    deleteOne(collectionName, query){
        const collection = db.collection(collectionName)
        return (new Promise(function(resolve, reject){
            collection.deleteOne(query, (err, result) => {
                if(err){
                    reject(err)
                }else{
                    resolve(result)
                }
            })
        }))
    }
    

}