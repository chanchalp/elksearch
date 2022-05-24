const router = require('express').Router();

const ElasticController = require('../controllers/elastic.contoller');

router.route('/bulkIndexing')
    .post(ElasticController.bulkIndexing);

router.route('/deleteIndexing')
    .delete(ElasticController.deleteIndexing);

module.exports = router;