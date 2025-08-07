const multer  = require('multer');
const storage = new multer.memoryStorage();
const upload  = multer({storage:storage});


const router = require('express').Router({
    caseSensitive   : true,
    strict          : true
});

const subcategory    = require('./controllers/AllsubcategoryController');
const authCheck     = require('../../../../../../util/authCheck');

//Routes..
router.post('/add' , authCheck , upload.single('image') ,subcategory.add );
router.put('/update', authCheck , upload.single('image') ,subcategory.update);
router.delete('/delete', authCheck ,subcategory.delete);
router.post('/list', authCheck ,subcategory.list );

exports.router = router;    