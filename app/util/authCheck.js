const _ = require("lodash");
const authToken = require("./authToken");
const userCache = require("./userCache");
const response = require("./response");

const adminUser = require('../module/services/admin/v1/AdminServices');
const userServices = require('../module/services/front/v1/userServices');
const crmUser = require('../module/services/crm/superAdminServices');

// const storeServer = require("../module/services/store/storeServices");

/**
 * Perform auth toke check, adds user to request on success
 * @param {Request} req request
 * @param {Response} res response
 */
module.exports = async function authorize(req, res, next) {
  try {
    const token = req.get("authToken") || req.query["authToken"];
    if (_.isNil(token) || token.length < 1) {
      return response.sendResponse(res,response.build("UNAUTHORIZED", { error: "Auth Token is required" }));
    }

    const decodedToken = await authToken.verifyAuthToken(token);
    // console.log('decodedToken',decodedToken);
    if(decodedToken){
      let userToken = await userCache.getToken([decodedToken.data.userId]);
      const user = decodedToken.data;
      if (!user || userToken != token) {
        return response.sendResponse(res,response.build("UNAUTHORIZED", { error: "Invalid or Expired Token" }));
      }
      
      if(user.userType === 'Super Admin'){
        const userData = await adminUser.getDataById(user.userId);
        user.email      = userData.admin_email;
        user.userType   = userData.admin_type;
        user.phone      = userData.admin_phone;
      } else if(user.userType === 'Users'){
        const userData = await userServices.getUserById(user.userId);      
        user.email        = userData.users_email;
        user.phone        = userData.users_mobile;
        user.country_code = userData.country_code;
        user.userType     = userData.users_type;
        user.userData     = userData;
      } else if(user.userType === 'CRM_ADMIN'){
        const userData = await crmUser.getUserById(user.userId);
        user.email      = userData.admin_email;
        user.userType   = userData.admin_type;
        user.phone      = userData.admin_phone;
      } else {
        return response.sendResponse(res,response.build("UNAUTHORIZED", { error: "Invalid or Expired Token" }));
      }
      _.set(req, "user", user);
      next();
    } else{
      return response.sendResponse(res,response.build("UNAUTHORIZED", { error: "Auth Token is required" }));
    }
  } catch (error) {
    console.log(error)
    return response.sendResponse(
      res,
      response.build("UNAUTHORIZED", { error: "Invalid or Expired Token" })
    );
  }
};
