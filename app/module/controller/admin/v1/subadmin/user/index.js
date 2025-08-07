const router = require('express').Router({
    caseSensitive   : true,
    strict          : true
});

const authCheck                 = require('../../../../../../util/authCheck');
const User                      = require('./controllers/UserController');
const UserPermissionController  = require('./controllers/UserPermissionController');

// Users Routes // 
router.post('/add'      , authCheck , User.add );
router.put('/update'    , authCheck , User.update);
router.delete('/delete' , authCheck , User.delete);
router.post('/list'     , authCheck , User.list);

// Users Permission Routes // 
router.post('/permission/add'    , authCheck , UserPermissionController.add);
router.put('/permission/update' , authCheck , UserPermissionController.update);
router.delete('/permission/delete' , authCheck , UserPermissionController.delete);
router.post('/permission/list'   , authCheck , UserPermissionController.list);

exports.router = router;    