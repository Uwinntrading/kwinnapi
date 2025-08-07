const router = require('express').Router({
    caseSensitive   : true,
    strict          : true
});
const authCheck     = require('../../../../../util/authCheck');
const checkAPIKey   = require('../../../../../util/checkAPIKey');
const log           = require('./controllers/logController');
const validation    = require('../../../../../middleware/admin/userValidation');

//Routes..
router.post('/add', log.add);
router.post('/list', checkAPIKey, log.list);
 
//Routes..
// router.post('/add' , authCheck ,upload.array('image', 10) ,Service.add );
// router.put('/update' , authCheck , upload.array('image') ,Service.update );
// router.delete('/delete' , authCheck ,Service.delete);
// router.post('/list' , authCheck ,Service.list);

exports.router = router;     