const router = require('express').Router({
    caseSensitive   : true,
    strict          : true
});

const Auth       = require('./controllers/AdminController');
const validation = require('../../../../../middleware/admin/userValidation');

//Routes..
router.post( '/login'     , Auth.login);
router.post( '/verifyOtp' , Auth.verifyOtp);
router.post( '/sendOTP'   , Auth.sendOTP);
router.post( '/forgotPassword'  ,validation.forgotPassword , Auth.UpdatePassword );
router.post( '/editProfile'  ,validation.editProfile  ); //, Auth.editProfile

exports.router = router;    