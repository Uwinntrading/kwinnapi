
const router = require('express').Router({
    caseSensitive   : true,
    strict          : true
});

const campaignController = require('./controllers/campaignController');


const authCheck = require("../../../../../util/authCheck");
const { checkAppAPIKey,  } = require("../../../../../middleware/front/userValidation");

router.post('/list', authCheck, campaignController.list);
router.post('/create-order', authCheck, campaignController.createOrder);
router.post('/global-setting', authCheck, campaignController.getGlobalSetting);
router.post('/order-history', authCheck, campaignController.orderHistory);
router.post('/order-details', authCheck, campaignController.orderDetails);
router.post('/order-summery', authCheck, campaignController.orderSummery);
router.post('/auto-printed', authCheck, campaignController.autoPrint);

exports.router = router;    