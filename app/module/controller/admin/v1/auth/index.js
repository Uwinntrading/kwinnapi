const router = require('express').Router({
    caseSensitive   : true,
    strict          : true
});
const authCheck     = require('../../../../../util/authCheck');
const checkAPIKey   = require('../../../../../util/checkAPIKey');
const Auth          = require('./controllers/AdminController');
const validation    = require('../../../../../middleware/admin/userValidation');

//Routes..
router.post('/login', checkAPIKey, Auth.login);
router.post('/verifyOtp' , checkAPIKey , Auth.verifyOtp);
router.post('/sendOTP'   , checkAPIKey , Auth.sendOTP);
router.post('/forgotPassword' , checkAPIKey , validation.forgotPassword , Auth.UpdatePassword );
router.put('/editProfile'  , authCheck , validation.editProfile  ,Auth.editProfile );
router.post('/profileList', authCheck, Auth.profileList );



//Routes..
// router.post('/add' , authCheck ,upload.array('image', 10) ,Service.add );
// router.put('/update' , authCheck , upload.array('image') ,Service.update );
// router.delete('/delete' , authCheck ,Service.delete);
// router.post('/list' , authCheck ,Service.list);

exports.router = router;     