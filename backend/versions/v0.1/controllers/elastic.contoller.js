const ElasticSearch = require('../services/elastic.service');
const { getDbList } = require('../../../connections/aiMongo');
const ElasticClient = require('../../../models/elastic/ElasticSearch');

const ElasticController = {
    bulkIndexing: async (req, resp) => {
        try {
            const collectionList = await getDbList();
            const arrayPromise = [];

            collectionList.forEach((aItem, index) => {
                const offset = 0;
                const prev = 0;
                const iIndex = 1;
                setTimeout(() => {
                    arrayPromise.push(ElasticSearch.IndexMongodbData('autocomplete', aItem.name, iIndex, offset, prev));
                }, 2000 * index);

            })
            const data = await Promise.all(arrayPromise);
            return resp.status(200).json({ success: true, collectionList })
        } catch (e) {
            console.log(e.message)
            return resp.status(500).json({ succes: false, message: 'Internal server error' });
        }
    },
    deleteIndexing: async (req, res) => {
        try {
            const { index: esIndexName } = req.query;
            ElasticClient.indices.delete({
                index: esIndexName //delete all indices '_all'
            }, function (err, res) {
                if (err) {
                    console.log(err.message);
                } else {
                    console.log('Indices have been deleted!', esIndexName);
                }
            });
            return res.status(200).json({ success: true, message: `Indices have been deleted! ${esIndexName}` });
        } catch (error) {
            console.log('error', error.message)
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }
}

module.exports = ElasticController;