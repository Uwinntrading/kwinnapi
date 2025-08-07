const router = require('express').Router({
    caseSensitive   : true,
    strict          : true
});

const authCheck = require("../../../../../util/authCheck");
const { checkAPIKey } = require("../../../../../middleware/front/userValidation");

const Recharge = require('./controllers/rechargeController');
router.get('/get-country', authCheck, Recharge.getCountries);
router.post('/get-operator', authCheck, Recharge.getOperator);
router.post('/get-all-provider', authCheck, Recharge.getAllProvider);
router.post('/get-all-plans', authCheck, Recharge.getAllPlans);
router.post('/create-recharge', authCheck, Recharge.createRecharge);
router.post('/history', authCheck, Recharge.rechargeHistory);
router.post('/summery', authCheck, Recharge.rechargeSummery);

exports.router = router;    