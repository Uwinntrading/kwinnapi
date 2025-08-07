const multer  = require('multer');
const storage = new multer.memoryStorage();
const upload  = multer({storage:storage});


const router = require('express').Router({
    caseSensitive   : true,
    strict          : true
});

const Service       = require('./controllers/PlayController');
const authCheck     = require('../../../../../../util/authCheck');

//Routes..
router.post('/add' , authCheck , upload.fields(
    [
        { name: 'photo0', maxCount: 1 },
        { name: 'photo1', maxCount: 1 },
        { name: 'photo2', maxCount: 1 },
        { name: 'photo3', maxCount: 1 },
        { name: 'photo4', maxCount: 1 },
        { name: 'photo5', maxCount: 1 },
        { name: 'photo6', maxCount: 1 },
        { name: 'photo7', maxCount: 1 },
        { name: 'photo8', maxCount: 1 }, 
        { name: 'photo9', maxCount: 1 },
        { name: 'photo10', maxCount: 1 } 
    ] 
    ) ,Service.add 
);

router.put('/update' , authCheck ,upload.fields(
    [
        { name: 'photo0', maxCount: 1 },
        { name: 'photo1', maxCount: 1 },
        { name: 'photo2', maxCount: 1 },
        { name: 'photo3', maxCount: 1 },
        { name: 'photo4', maxCount: 1 },
        { name: 'photo5', maxCount: 1 },
        { name: 'photo6', maxCount: 1 },
        { name: 'photo7', maxCount: 1 },
        { name: 'photo8', maxCount: 1 }, 
        { name: 'photo9', maxCount: 1 },
        { name: 'photo10', maxCount: 1 } 
    ] 
    ) ,Service.update );
router.delete('/delete' , authCheck ,Service.delete);
router.post('/list' , authCheck ,Service.list);

exports.router = router;    