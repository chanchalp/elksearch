const elasticsearch = require('elasticsearch');
const config = require('../../config/config.elastic');

const connection = config.elastic.host;
const esClient = new elasticsearch.Client({
  host: connection,
  requestTimeout: 5 * 60 * 1000,
  maxRetries: 5
});

esClient.ping({
  requestTimeout: 5 * 60 * 1000
}, (error) => {
  if (error) {
    console.log('ELASTIC ERROR', error);
  } else {
    console.log('ELASTIC OKAY', { url: connection });
  }
});

module.exports = esClient;