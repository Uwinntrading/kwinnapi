const router = require('express').Router({
    caseSensitive   : true,
    strict          : true
});

// User Detail
const user = require('./controller/userController');

//website
const authCheck = require("../../../../../util/authCheck");
const { checkThirdPartyAPIKey } = require("../../../../../middleware/front/userValidation");

router.post('/list',authCheck, user.list);
router.post('/settle-due',authCheck, user.settleDueAmount);
router.post('/collect-due',authCheck, user.collectDueAmount);
router.post('/update-collection',authCheck, user.updateCollection);
router.post('/update-due-amount',authCheck, user.updateDueAmount);

exports.router = router;
