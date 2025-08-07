const router = require('express').Router({
    caseSensitive   : true,
    strict          : true
});

// const authCheck = require("../../../../../util/authCheck");
const { checkAPIKey } = require("../../../../../middleware/front/userValidation");

const Orders = require('./controllers/orderController');
router.post('/order/list',checkAPIKey, Orders.list);
router.post('/order/update-formated-date',checkAPIKey, Orders.updateFormatedDate);
router.post('/order/move-to-archive',checkAPIKey, Orders.movetoarchive);

const Loadbalance = require('./controllers/loadbalanceController');
router.post('/loadbalance/list',checkAPIKey, Loadbalance.list);
router.post('/loadbalance/update-formated-date',checkAPIKey, Loadbalance.updateFormatedDate);
router.post('/loadbalance/move-to-archive',checkAPIKey, Loadbalance.movetoarchive);

const Winners = require('./controllers/winnersController');
router.post('/winners/list',checkAPIKey, Winners.list);
router.post('/winners/update-formated-date',checkAPIKey, Winners.updateFormatedDate);
router.post('/winners/move-to-archive',checkAPIKey, Winners.movetoarchive);


exports.router = router;    