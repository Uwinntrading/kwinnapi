const router = require('express').Router({
    caseSensitive   : true,
    strict          : true
});

const Department    = require('./controllers/DepartmentController');
const authCheck     = require('../../../../../../util/authCheck');

//Routes..
router.post( '/add'    , authCheck ,Department.add );
router.put( '/update' , authCheck ,Department.update);
router.delete( '/delete' , authCheck ,Department.delete);
router.post( '/list' , authCheck ,Department.list);

exports.router = router;    