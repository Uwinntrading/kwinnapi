const express = require("express");
const cookieParser = require("cookie-parser");
const constant = require("../config/constant");
const publicDir = require("path").join("../app/", "/public");

module.exports = (app) => {
  app.use(cookieParser());
  app.use(express.static(publicDir));
  app.use("/v1/admin/auth", require("../module/controller/admin/v1/auth").router);
  app.use("/v1/admin/module", require("../module/controller/admin/v1/module").router);
  app.use("/v1/admin/users", require("../module/controller/admin/v1/users").router);
  app.use("/v1/admin/login_log", require("../module/controller/admin/v1/log").router);

  app.use("/v1/admin/subadmin/department", require("../module/controller/admin/v1/subadmin/department").router);
  app.use("/v1/admin/subadmin/designation", require("../module/controller/admin/v1/subadmin/designation").router);
  app.use("/v1/admin/subadmin/users", require("../module/controller/admin/v1/subadmin/user").router);

  // app.use("/front/v1/orders", require("../module/controller/front/v1/orders").router);
  app.use("/v1/admin/cetegory", require("../module/controller/admin/v1/category/allcategory").router);
  app.use("/v1/admin/subCetegory", require("../module/controller/admin/v1/category/allsubcategory").router);
  app.use("/v1/admin/products", require("../module/controller/admin/v1/campaign").router);
  app.use("/v1/admin/orders", require("../module/controller/admin/v1/orders").router);
  app.use("/v1/admin/internation-recharges", require("../module/controller/admin/v1/internationRecharges").router);

  // CMS Rotes
  app.use("/v1/admin/cms/pagebanners", require("../module/controller/admin/v1/cms/pagebanners").router);
  app.use("/v1/admin/cms/common", require("../module/controller/admin/v1/cms/common").router);
  app.use("/v1/admin/cms/generaldata", require("../module/controller/admin/v1/cms/generaldata").router);
  app.use("/v1/admin/cms/enablepayment", require("../module/controller/admin/v1/cms/enablepayment").router);
  app.use("/v1/admin/cms/enablesms", require("../module/controller/admin/v1/cms/enablesms").router);
  app.use("/v1/admin/cms/pagevideos", require("../module/controller/admin/v1/cms/pagevideos").router);
  app.use("/v1/admin/cms/testimonials", require("../module/controller/admin/v1/cms/testimonials").router);
  app.use("/v1/admin/cms/uwin_permission", require("../module/controller/admin/v1/cms/uwinPermission").router);
  app.use("/v1/admin/cms/campaign_access_permission", require("../module/controller/admin/v1/cms/campaignAccessPermission").router);
  app.use("/v1/admin/cms/play", require("../module/controller/admin/v1/cms/play").router);
  app.use("/v1/admin/cms/faq", require("../module/controller/admin/v1/cms/faq").router);
  
  app.use("/v1/admin/win/campaignfreezing", require("../module/controller/admin/v1/uwin/campaignfreezing").router);
  app.use("/v1/admin/win/contentPage", require("../module/controller/admin/v1/uwin/contentPage").router);
  app.use("/v1/admin/win/allwinners", require("../module/controller/admin/v1/uwin/allwinners").router);

  app.use("/v1/admin/campaign", require("../module/controller/admin/v1/campaign").router);
  app.use("/v1/admin/lotto-winners", require("../module/controller/admin/v1/lottowinners").router);
  app.use("/v1/admin/wallet-statement", require("../module/controller/admin/v1/walletStatement").router);

  //Front End Routes
  app.use("/v1/users", require("../module/controller/front/v1/users").router);
  app.use("/v1/common", require("../module/controller/front/v1/common").router);
  app.use("/v1/products", require("../module/controller/front/v1/products").router);
  app.use("/v1/order", require("../module/controller/front/v1/orders").router);

  //International Recharge
  app.use("/v1/mobile-recharge", require("../module/controller/front/v1/mobile_recharge").router);
  app.use("/v1/campaign", require("../module/controller/front/v1/campaign").router);
  app.use("/v1/admin/loadbalance", require("../module/controller/v1/loadbalance").router);

  //Lotto Winners
  app.use("/v1/lotto-winners", require("../module/controller/front/v1/lottowinners").router);
  app.use("/v1/admin/counter", require("../module/controller/admin/v1/counters").router);

  //CRM
  app.use("/v1/admin/analyzer", require("../module/controller/admin/v1/analyzer").router);
  app.use("/v1/crm/users", require("../module/controller/thirdParty/v1/users").router);
  app.use("/v1/crm/invoice", require("../module/controller/thirdParty/v1/invoice").router);
  app.use("/v1/crm/analyser", require("../module/controller/thirdParty/v1/analyser").router);
  app.use("/v1/crm/customer", require("../module/controller/thirdParty/v1/customer").router);
  app.use("/v1/crm/active-logs", require("../module/controller/thirdParty/v1/activeLogs").router);
  app.use("/v1/crm/transaction", require("../module/controller/thirdParty/v1/transaction").router);

  app.use("/v1/admin/missed-recharge", require("../module/controller/admin/v1/missed-recharge").router);
  app.use("/v1/crm/general-dada", require("../module/controller/thirdParty/v1/generalData").router);

};