const router = require('express').Router({
    caseSensitive   : true,
    strict          : true
});

// User Detail
const user = require('./controller/userController');

//website
const authCheck = require("../../../../../util/authCheck");
const { checkThirdPartyAPIKey } = require("../../../../../middleware/front/userValidation");

router.post('/login',checkThirdPartyAPIKey, user.login);
router.post('/verify-login-otp',checkThirdPartyAPIKey, user.verifyLoginOTP);
router.post('/update-profile', authCheck,user.updateProfile);

router.get('/logout',authCheck, user.logout);

router.post('/forgot-password',checkThirdPartyAPIKey, user.forgotPassword);
router.post('/reset-password',checkThirdPartyAPIKey, user.resetPassword);

router.post('/get-sub-admin', authCheck, user.getSubAdminUsers);
router.post('/create-sub-admin/:editId?', authCheck, user.createSubAdminUser);
router.post('/get-permission', authCheck, user.getPermission);
router.post('/change-status', authCheck, user.changeStatus);


router.post('/sent-otp', authCheck, user.sentOtp);
router.post('/verify-otp', authCheck, user.verifyOtp);

router.post('/test-email',user.testfuntion);

exports.router = router;
