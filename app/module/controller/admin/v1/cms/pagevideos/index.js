const multer  = require('multer');
const storage = new multer.memoryStorage();
const upload  = multer({storage:storage});


const router = require('express').Router({
    caseSensitive   : true,
    strict          : true
});

const Service       = require('./controllers/AllpageVideoController');
const authCheck     = require('../../../../../../util/authCheck');

//Routes..
router.post('/add' , authCheck , upload.single('slider_video') ,Service.add );
router.put('/update' , authCheck , upload.single('slider_video') ,Service.update );
router.delete('/delete' , authCheck ,Service.delete);
router.post('/list' , authCheck ,Service.list);

exports.router = router;    