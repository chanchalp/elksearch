const { getDbInstance } = require('../../../connections/aiMongo');
const ElasticSearch = require('../../../models/elastic/ElasticSearch');
const moment = require('moment');
const env = process.env.NODE_ENV || 'local';
var itemQue = [];
var limitData = 2000;

const ElasticService = {
    IndexMongodbData: (esIndexName, collectionName, iIndex, offset, prev) => {
        getDbInstance(collectionName).find({}).skip(offset).limit(limitData).sort({ _id: -1 }).toArray(function (err, result) {
            if (result.length > 0) {
                process.nextTick(function () {
                    result.forEach(element => {
                        if (element._id) {
                            itemQue.push
                                ({
                                    index: {
                                        _index: esIndexName,
                                        _id: element._id
                                    }
                                });
                            delete element._id;
                        } else {
                            itemQue.push
                                ({
                                    index: {
                                        _index: esIndexName,
                                        _id: iIndex
                                    }
                                });
                        }
                        element.ENV = env;
                        itemQue.push(JSON.stringify(element));
                        iIndex++;
                    }); // End For loop

                    if (itemQue.length > 0) {
                        ElasticService.bulkop(itemQue, function (err, res) {
                            prev = offset;
                            offset = offset + limitData;

                            console.log("prevSet :" + prev + " newSet : " + offset)
                            if (err)
                                console.log(err)
                            else if (res) {
                                ElasticService.IndexMongodbData(esIndexName, collectionName, iIndex, offset, prev);
                                console.log("Data Items added succesfully :" + res.items.length, esIndexName, iIndex)
                            }
                        }) //end Bulk copy Elastic search   
                    }
                }); // Process Next tick
            } // end if result  
            else {
                console.log("All the data successfully imported into the Elasticsearch!");
                // process.exit()
            }
        }); // end select query mongo collection table
        return true;
    },

    // Function to bulk copy data to elastic search
    bulkop: (data, callback) => {
        ElasticSearch.bulk({
            body: data
        }, function (error, response) {
            if (callback)
                callback(error, response);
        });
        data = [];
    },
}


module.exports = ElasticService;