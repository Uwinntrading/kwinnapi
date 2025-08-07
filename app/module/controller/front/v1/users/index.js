const router = require('express').Router({
    caseSensitive   : true,
    strict          : true
});

const authCheck = require("../../../../../util/authCheck");
const { checkAPIKey, signupForm } = require("../../../../../middleware/front/userValidation");

const Users = require('./controllers/usersControllers');
router.post('/sign-up'   ,checkAPIKey, signupForm, Users.signup);
router.post('/login'     ,checkAPIKey, Users.login);
router.post('/verify-otp',checkAPIKey, Users.verifyOtp);
router.post('/forgot-password',checkAPIKey, Users.forgotPassword);
router.post('/reset-password',checkAPIKey, Users.resetPassword);

router.get('/logout',authCheck, Users.logout);

router.get('/get-user-data',authCheck, Users.getUserData);
router.post('/edit-user',authCheck, Users.editUser);
router.post('/send-otp',authCheck, Users.sentOtp);
router.post('/update-summery-pin',authCheck, Users.updateSummeryPin);
router.post('/verify-summery-pin',authCheck, Users.verifySummeryPin);

exports.router = router;    