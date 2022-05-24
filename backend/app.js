const path = require('path');
require('dotenv').config();
const ConfigEnv = require('./config/config.environment');
const express = require('express');
const app = new express();
const cors = require('cors');
const bodyParser = require('body-parser');

const PORT = process.env.PORT || 3000;

const elasticRroutes = require('./versions/v0.1/routes/elastic.routes');
const aiRoutes = require('./versions/v0.1/routes/ai.routes');

// Initialize the models and db connection
require('./models/mongo');

// Middleware
app.use(cors());
app.options('*', cors());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});
// app.use(express.json())
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.json({ extended: true, limit: '50mb' }));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '../../frontend/index.html'));
});

// For display API URL call with params and body for testing
app.use((req, res, next) => {
    console.log(`API URL : ${req.url}`);
    next();
});

// initialize routes
app.use('/api', [elasticRroutes, aiRoutes]);
// require('./versions/v1')(app);

app.listen(PORT, ()=> {
console.log(`server is running on http://localhost:${PORT}`);
})

module.exports = app;