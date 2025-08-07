const router = require('express').Router({
    caseSensitive   : true,
    strict          : true
});

const walletStatementController = require('./controllers/walletStatementController');
const authCheck = require("../../../../../util/authCheck");

//CMS Banners
router.post('/list', authCheck, walletStatementController.list);
router.post('/history', authCheck, walletStatementController.history);
router.put('/update', authCheck, walletStatementController.update);

exports.router = router;
