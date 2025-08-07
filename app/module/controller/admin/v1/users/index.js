const router = require('express').Router({
    caseSensitive   : true,
    strict          : true
});

const Users      = require('./controllers/UsersController');
const authCheck  = require('../../../../../util/authCheck');

//Routes..
router.post( '/add'     , authCheck , Users.add    );
router.put( '/update'   , authCheck , Users.update );
router.delete('/delete' , authCheck , Users.delete );
router.post( '/list'    , authCheck , Users.list  );

exports.router = router;    