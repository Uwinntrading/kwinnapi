const router = require('express').Router({
    caseSensitive   : true,
    strict          : true
});

const invoiceController = require('./controllers/invoiceController');

const { checkThirdPartyAPIKey } = require("../../../../../middleware/front/userValidation");
const authCheck = require("../../../../../util/authCheck");
//Service categories
router.post('/loadbalance/list', checkThirdPartyAPIKey, invoiceController.loadBalanceList);
router.post('/users/list', checkThirdPartyAPIKey, invoiceController.usersList);

router.post('/list', checkThirdPartyAPIKey, invoiceController.invoiceList);
router.post('/create', authCheck, invoiceController.createInvoice);
router.post('/update', checkThirdPartyAPIKey, invoiceController.updateInvoiceData);
router.post('/delete/:id', checkThirdPartyAPIKey, invoiceController.deleteInvoice);

//Request
router.post('/request/create', authCheck, invoiceController.createRequest);
router.post('/request/list', checkThirdPartyAPIKey, invoiceController.requestList);
router.post('/request/delete/:id', checkThirdPartyAPIKey, invoiceController.deleteRequest);
router.post('/request/change-status/:id', checkThirdPartyAPIKey, invoiceController.requestChangeStatus);


exports.router = router;    