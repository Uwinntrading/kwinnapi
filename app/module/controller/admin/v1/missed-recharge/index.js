const router = require('express').Router({
    caseSensitive   : true,
    strict          : true
});

const missedRechargeController = require('./controllers/missedRechargeController');
const authCheck = require("../../../../../util/authCheck");

router.post('/add', authCheck, missedRechargeController.add);
router.post('/list', authCheck, missedRechargeController.list);
exports.router = router;
