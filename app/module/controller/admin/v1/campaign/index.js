const multer  = require('multer');
const storage = new multer.memoryStorage();
const upload  = multer({storage:storage});

const router = require('express').Router({
    caseSensitive   : true,
    strict          : true
});

const campaignController = require('./controllers/campaignController');
const prizeController = require('./controllers/prizeController');
const settingController = require('./controllers/settingController');
const orderController = require('./controllers/orderController');


const authCheck = require("../../../../../util/authCheck");
const { checkAPIKey } = require("../../../../../middleware/front/userValidation");

router.post('/list', authCheck, campaignController.list);
router.post('/addeditdata', authCheck, upload.fields([{name: 'image', maxCount: 1 },{ name: 'product_image', maxCount: 1  }]),campaignController.addEditData);

router.put('/change-status', authCheck, campaignController.changeStatus);

router.put('/change-draw-date', authCheck, campaignController.changeDrawDate);
router.post('/autodrow-update', authCheck, campaignController.autoDrawDate);

router.post('/addeditprize', authCheck, upload.single('image'),prizeController.addEditData);
router.post('/prize-list', authCheck, prizeController.list);

router.post('/addeditsettings', authCheck, settingController.addEditData);
router.post('/setting-list', authCheck, settingController.list);

router.post('/order-list', authCheck, orderController.list);
router.post('/cancel-order', authCheck, orderController.cancelOrder);
router.post('/order/statistics-reports', authCheck, orderController.statisticsReports);

exports.router = router;
