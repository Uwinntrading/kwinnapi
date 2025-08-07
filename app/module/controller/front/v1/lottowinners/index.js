
const router = require('express').Router({
    caseSensitive   : true,
    strict          : true
});

const lottoWinnerController = require('./controllers/lottoWinnersController');


const authCheck = require("../../../../../util/authCheck");

router.post('/check-winner', authCheck, lottoWinnerController.checkWinner);
router.post('/redeem-winner', authCheck, lottoWinnerController.redeemWinner);
router.post('/redeem-list', authCheck, lottoWinnerController.redeemList);


exports.router = router;    