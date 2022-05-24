const { MongoClient } = require('mongodb');

// Config
const config = require('../config/config.environment');

// Connection URL
// const env = process.env.NODE_ENV || 'development';
// if (env === 'test') {
//   config.url = process.env.MONGO_URL || 'mongodb://localhost:27017/';
// }
const client = new MongoClient(config.db.connectionString);

const main = async () => {
    // Use connect method to connect to the server
    await client.connect();
    return true;
};

main()
    .then(() => {
        console.log('Mongodb connected:', { url: config.db.connectionString });
    })
    .catch(err => console.log(err));

const getDbList = async () => {
    const _db = client.db('sakila');
    const collections = await _db.listCollections().toArray();
    return collections;
};
const getDbInstance = (collectionName) => {
    const _db = client.db('sakila');
    return _db.collection(collectionName);
};

module.exports = { getDbList, getDbInstance };