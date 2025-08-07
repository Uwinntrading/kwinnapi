const router = require('express').Router({
    caseSensitive   : true,
    strict          : true
});


const { checkThirdPartyAPIKey } = require("../../../../../middleware/front/userValidation");
const authCheck = require("../../../../../util/authCheck");
const analyserController = require('./analyserController');
//Service categories
router.post('/campaign-list', authCheck, analyserController.campaignList);
router.post('/order-reports', authCheck, analyserController.orderReports);
router.post('/create-winners', authCheck, analyserController.createWinner);
router.post('/general-data', authCheck, analyserController.getGeneralData);

router.post('/create-bulk-orders', authCheck, analyserController.autoCreateOrder);


exports.router = router;    