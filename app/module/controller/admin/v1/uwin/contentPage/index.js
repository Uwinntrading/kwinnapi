const multer  = require('multer');
const storage = new multer.memoryStorage();
const upload  = multer({storage:storage});
const router = require('express').Router({
    caseSensitive: true,
    strict: true
});

const Service = require('./controllers/ContentPageController');
const authCheck = require('../../../../../../util/authCheck');

//Routes..
const FILES =  upload.fields([{name: 'image', maxCount: 1 },{ name: 'video', maxCount: 1  },{ name: 'link_thumbnail', maxCount: 1  }])
router.post('/add', authCheck,FILES, Service.add);
router.put('/update', authCheck,FILES, Service.update);
router.put('/delete', authCheck,FILES, Service.delete);
router.post('/list', authCheck, Service.list);

exports.router = router; 