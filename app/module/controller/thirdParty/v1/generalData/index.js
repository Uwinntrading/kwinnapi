const router = require('express').Router({
    caseSensitive   : true,
    strict          : true
});


const { checkThirdPartyAPIKey } = require("../../../../../middleware/front/userValidation");
const authCheck = require("../../../../../util/authCheck");
const generalDataController = require('./generalDataController');
// //Service categories
router.get('/', authCheck, generalDataController.getGeneralData);
router.post('/addeditdata', authCheck, generalDataController.addEditData);
// router.post('/order-reports', authCheck, analyserController.orderReports);
// router.post('/create-winners', authCheck, analyserController.createWinner);

// router.post('/create-bulk-orders', authCheck, analyserController.autoCreateOrder);


exports.router = router;    