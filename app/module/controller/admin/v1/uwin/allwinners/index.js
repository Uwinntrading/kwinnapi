const multer  = require('multer');
const storage = new multer.memoryStorage();
const upload  = multer({storage:storage});
const router = require('express').Router({
    caseSensitive: true,
    strict: true
});

const Service = require('./controllers/allwinnersController');
const authCheck = require('../../../../../../util/authCheck');

//Routes..
router.post('/add', authCheck, Service.add);
router.put('/update', authCheck, Service.update);
router.all('/delete', authCheck, Service.delete);
router.post('/list', authCheck, Service.list);
router.post('/batchlist', authCheck, Service.batchlist);
router.post('/batchupdate', authCheck, Service.batchupdate);

exports.router = router; 