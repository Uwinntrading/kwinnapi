const router = require('express').Router({
    caseSensitive   : true,
    strict          : true
});

const authCheck = require("../../../../../util/authCheck");
const { checkAPIKey } = require("../../../../../middleware/front/userValidation");

const Common = require('./controllers/commonContoller');
router.get('/country-code',checkAPIKey, Common.getCountryCode);
router.post('/country/add-favorite',authCheck, Common.countryAddToFavorite);
router.post('/country/remove-favorite',authCheck, Common.countryRemoveToFavorite);
router.post('/country/favorite-list',authCheck, Common.countryFavoriteList);
router.get('/general-info', authCheck, Common.generalInfo );
router.post('/pagebanner', authCheck, Common.pagebanner );

exports.router = router;    