const router = require('express').Router({
    caseSensitive: true,
    strict: true
});

const Service = require('./controllers/EnablePaymentController');
const authCheck = require('../../../../../../util/authCheck');

//Routes..
router.post('/add', authCheck, Service.add);
router.put('/update', authCheck, Service.update);
router.delete('/delete', authCheck, Service.delete);
router.post('/list', authCheck, Service.list);

exports.router = router; 0