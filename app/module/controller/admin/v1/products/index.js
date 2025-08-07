const multer  = require('multer');
const storage = new multer.memoryStorage();
const upload  = multer({storage:storage});


const router = require('express').Router({
    caseSensitive   : true,
    strict          : true
});

const Controller         = require('./controllers/AllproductController');
const settingController  = require('./controllers/settingController');
const prizeContorllers  = require('./controllers/prizeContorllers');
const authCheck          = require('../../../../../util/authCheck')

//Routes..
// router.post('/add'      , authCheck , upload.single('image') ,Controller.add );
// router.put('/update'    , authCheck , upload.single('image') ,Controller.update);

router.post('/add' , authCheck ,   upload.fields([{ name: 'product_image', maxCount: 1 },{ name: 'game_logo', maxCount: 1 },]) , Controller.add );
router.put('/update' , authCheck , upload.fields([{ name: 'product_image', maxCount: 1 },{ name: 'game_logo', maxCount: 1 },{ name: 'game_rule_image', maxCount: 1 },]) , Controller.update );





router.delete('/delete' , authCheck , Controller.delete);
router.post('/list'     , authCheck , Controller.list );

router.post('/settings/add'      , authCheck , upload.single('image') ,settingController.add );
router.put('/settings/update'    , authCheck , upload.single('image') ,settingController.update);
router.delete('/settings/delete' , authCheck , settingController.delete);
router.post('/settings/list'     , authCheck , settingController.list );

router.post('/prize/add'      , authCheck , upload.single('image') ,prizeContorllers.add );
router.put('/prize/update'    , authCheck , upload.single('image') ,prizeContorllers.update);
router.delete('/prize/delete' , authCheck , prizeContorllers.delete);

router.post('/prize/list'     , authCheck , prizeContorllers.list );
exports.router = router;    