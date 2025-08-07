
const router = require('express').Router({
    caseSensitive   : true,
    strict          : true
});
const AnalyzerController = require('./controller/analyzerController');

const TestMatchingController = require('./controller/testmatching');
const authCheck     = require('../../../../../util/authCheck');
router.post('/list', AnalyzerController.list);
router.post('/test-matching', TestMatchingController.insertUpdatedb);
exports.router = router;  