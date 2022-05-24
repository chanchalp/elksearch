const ElasticSearch = require('../../../models/elastic/ElasticSearch');
const MappingJSON = require('../../../models/elastic/mapping.json');
const SettingJSON = require('../../../models/elastic/setting.json');

const AIController = {
    search: async (req, res) => {
        try {
            const { term, page, limit } = req.query;
            const autoTerms = await ElasticSearch.search({
                index: 'search',
                body: {
                    // from: page * limit,
                    size: 10,
                    query: {
                        multi_match: {
                            query: term,
                            fields: ["*"],
                            type: "most_fields"
                        }
                    }
                }
            });

            const reduceTerms = [];
            let autoTermsHits = autoTerms.hits.hits;
            Object.keys(autoTermsHits).forEach((eachTerm) => {
                delete autoTermsHits[eachTerm]._source.ENV;
                reduceTerms.push(autoTermsHits[eachTerm]._source);
                reduceTerms.push(autoTermsHits[eachTerm]._score);
            });

            return res.status(200).json({ success: true, response: reduceTerms });
        } catch (error) {
            console.log(error.message);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
    },
    autocomplete: async (req, res) => {
        try {
            const { term, page, limit, field } = req.query;
            const autoTerms = await ElasticSearch.search({
                index: 'autocomplete',
                body: {
                    size: 50,
                    query: {
                        query_string: {
                            query: `${term}*`,
                            fields: field ? [field] : ["*"],
                            // lenient: true,
                            type: "most_fields"
                        }
                    },
                }
            });

            const reduceTerms = [];
            let autoTermsHits = autoTerms.hits.hits;
            Object.keys(autoTermsHits).forEach((eachTerm) => {
                delete autoTermsHits[eachTerm]._source.ENV;
                reduceTerms.push(autoTermsHits[eachTerm]._source);
                // reduceTerms.push(autoTermsHits[eachTerm]._score);
            });

            return res.status(200).json({ success: true, response: reduceTerms });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
    },
    updateElasticSetting: async (req, res) => {
        try {
            // var mapping;
            const { indexname } = req.query;
            await ElasticSearch.indices.create({ index: indexname })
            await ElasticSearch.indices.close({ index: indexname });
            await ElasticSearch.indices.putSettings({
                index: indexname,
                body: { "settings": SettingJSON }
            });

            await ElasticSearch.indices.open({ index: indexname });
            console.log("Mapping Json");
            ElasticSearch.indices.putMapping({
                index: indexname,
                body: MappingJSON
            });
            return res.status(200).json({ success: true, response: [] })
        } catch (error) {
            console.log(error);
            return res.status(500).json({ success: true, message: "Internal server error" });
        }

    }
}

module.exports = AIController;