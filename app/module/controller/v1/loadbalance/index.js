const multer  = require('multer');
const storage = new multer.memoryStorage();
const upload  = multer({storage:storage});


const router = require('express').Router({
    caseSensitive   : true,
    strict          : true
});

const Service       = require('./controllers/LoadBalanceController');
const authCheck     = require('../../../../util/authCheck');

//Routes..
router.post( '/add'   , authCheck ,Service.add );
router.post( '/update' , authCheck ,Service.update );
router.post( '/list' , authCheck ,Service.list);
// router.delete( '/delete' , authCheck ,Service.delete);

exports.router = router;    