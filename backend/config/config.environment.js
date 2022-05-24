const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, `../.env.${process.env.NODE_ENV}`) })

module.exports = {
    env: process.env.NODE_ENV,
    db: {
        // connectionString: process.env.DEV_MONGODB_URL || process.env.STAGE_MONGODB_URL || 'mongodb+srv://TrukkerSearch:Qazwersq1@cluster0.zcdqi.mongodb.net/TrukkerSearch?retryWrites=true&w=majority',
        // connectionString: 'mongodb+srv://stage:stage@stage-finops.cni8c.mongodb.net/Finops?retryWrites=true&w=majority'
        connectionString: 'mongodb://localhost:27017/sakila'
    },
    option: {
        autoIndex: false, // don't build indexes
        poolSize: 100,
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 45000,
        family: 4
    }
}