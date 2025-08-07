const multer  = require('multer');
const storage = new multer.memoryStorage();
const upload  = multer({storage:storage});


const router = require('express').Router({
    caseSensitive   : true,
    strict          : true
});

const Service       = require('./controllers/AllmoduleController');
const authCheck     = require('../../../../../util/authCheck');

//Routes..
router.post( '/add'    , authCheck , upload.single('image') ,Service.add );
router.put( '/update'  , authCheck , upload.single('image') ,Service.update );
router.delete( '/delete' , authCheck , Service.delete );
router.post( '/list'     , authCheck , Service.list );

exports.router = router;    