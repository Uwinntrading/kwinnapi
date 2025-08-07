const router = require('express').Router({
    caseSensitive   : true,
    strict          : true
});

const counterController = require('./controllers/counterController');
const authCheck = require("../../../../../util/authCheck");

router.post('/list', authCheck, counterController.list);
exports.router = router;
