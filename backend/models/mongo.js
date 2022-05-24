require('dotenv').config();
const mongoose = require('mongoose');
const ConfigEnv = require('../config/config.environment');

// Resolve the depreciation warning
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);

mongoose.Promise = global.Promise;

// Database connection
console.log('ConfigEnv.db.connectionString', ConfigEnv.db.connectionString)
mongoose.connect(ConfigEnv.db.connectionString, ConfigEnv.option)
    .then(() => {
        console.log('Mongo Connected', { url: ConfigEnv.db.connectionString })
    },
        (error) => {
            console.log('MongoDb Failed', error)
        }
    );

mongoose.connection
    .on('error', err => console.log('Mongo onError:', err))
    .on('connected', err => console.log('Mongodb connected:', err))
    .on('open:', err => console.log('Mongo open', err));