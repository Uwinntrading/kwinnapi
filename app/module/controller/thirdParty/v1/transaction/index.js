const router = require('express').Router({
    caseSensitive   : true,
    strict          : true
});

const txnController = require('./transactionController.js');

const authCheck = require("../../../../../util/authCheck");

router.post('/list', authCheck, txnController.list);
router.post('/reverse', authCheck, txnController.reverse);


exports.router = router;    