const router = require('express').Router({
    caseSensitive   : true,
    strict          : true
});

const authCheck = require("../../../../../util/authCheck");
const { checkAPIKey } = require("../../../../../middleware/front/userValidation");

const Products = require('./controllers/productsControllers');
router.post('/list', checkAPIKey, Products.list);
router.get('/setting', checkAPIKey, Products.setting);


exports.router = router;    