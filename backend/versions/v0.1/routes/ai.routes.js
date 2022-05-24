const router = require('express').Router();

const AIController = require('../controllers/ai.controller');

router.route('/search')
    .get(AIController.search);

router.route('/search/autocomplete')
    .get(AIController.autocomplete);

router.route('/updateSettingMapping')
    .put(AIController.updateElasticSetting);

module.exports = router;