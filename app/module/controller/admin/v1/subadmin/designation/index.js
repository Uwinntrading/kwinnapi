const router = require('express').Router({
    caseSensitive   : true,
    strict          : true
});

const Designation    = require('./controllers/DesignationController');
const authCheck     = require('../../../../../../util/authCheck');

//Routes..
router.post( '/add'    , authCheck ,Designation.add );
router.put( '/update' , authCheck ,Designation.update);
router.delete( '/delete' , authCheck ,Designation.delete);
router.post( '/list' , authCheck ,Designation.list);

exports.router = router;    