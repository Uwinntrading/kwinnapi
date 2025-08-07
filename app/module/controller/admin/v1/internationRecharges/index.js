const router = require('express').Router({
    caseSensitive   : true,
    strict          : true
});

const Service       = require('./controllers/InternationRechargesController');
const authCheck     = require('../../../../../util/authCheck');

//Routes..
router.post( '/list' , authCheck ,Service.list);
router.put( '/update' , authCheck ,Service.update);
router.post( '/statistics-reports' , authCheck ,Service.statisticsReports);
exports.router = router;    