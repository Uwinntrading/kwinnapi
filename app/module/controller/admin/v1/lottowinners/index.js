const multer = require('multer');
const storage = new multer.memoryStorage();
const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const allowedMimeTypes = ['text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
        if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only excel are allowed.'));
        }
    },
    limits: { fileSize: 4 * 1024 * 1024 }
});

const router = require('express').Router({
    caseSensitive   : true,
    strict          : true
});

const winnerController = require('./controllers/winnerController');


const authCheck = require("../../../../../util/authCheck");

//CMS Banners
router.post('/list', authCheck, winnerController.list);
router.post('/upload-winner', authCheck, upload.single('file'), winnerController.uploadWinner);
router.post('/winner-summery', authCheck, winnerController.orderSummery);

router.post('/change-status', authCheck, winnerController.changeStatus);
router.post('/delete', authCheck, winnerController.delete);

router.post('/bulk-change-status', authCheck, winnerController.bulkChangeStatus);
router.post('/bulk-delete', authCheck, winnerController.bulkDelete);

router.post('/batch-change-status', authCheck, winnerController.batchChangeStatus);
router.post('/batch-delete', authCheck, winnerController.batchDelete);

exports.router = router;
