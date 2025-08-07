const router = require('express').Router({
    caseSensitive   : true,
    strict          : true
});

const logController = require('./logController');


const authCheck = require("../../../../../util/authCheck");

router.post('/list', authCheck, logController.list);
router.post('/create', authCheck, logController.create);

exports.router = router;
