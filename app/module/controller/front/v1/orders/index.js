const router = require('express').Router({
    caseSensitive   : true,
    strict          : true
});

const { checkAPIKey, createOrder } = require("../../../../../middleware/front/userValidation");
const authCheck = require("../../../../../util/authCheck")
const Orders = require('./controllers/orderController');
router.post('/create',authCheck,createOrder, Orders.create);
router.post('/mark-as-print',authCheck, Orders.markAsPrint);
router.post('/list',authCheck, Orders.list);
router.post('/draw-list',checkAPIKey, Orders.drawList);
router.post('/summery-reports',authCheck, Orders.orderSummeryReports);
router.post('/product-summery-reports',authCheck, Orders.productSummeryReports);

exports.router = router;    