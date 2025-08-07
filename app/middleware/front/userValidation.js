const response = require('../../util/response');
const constant = require('../../config/constant');
const { isValidObjectId } = require("../../util/valueChecker");
exports.checkAPIKey = async function (req, res, next) {
    const {key} = req.headers;
    if(key === constant.apikey){
        next();
    }else{
        return response.sendResponse(res, response.build("ERROR_TOKEN_REQUIRED", { error: 'Unauthorized Request' }) );
    }
}

exports.validateAPI = async function (req, res, next) {
    const { key } = req.headers;
    if(key === constant.WEBAPIKEY){
        next();
    }else{
        return response.sendResponse(res, response.build("ERROR_TOKEN_REQUIRED", { error: 'Unauthorized Request' }) );
    }
}

exports.signupForm = async function (req, res, next) {
    try {
        const { users_name, last_name, users_email, country_code, users_mobile, users_password } = req.body;
        if(!users_name){
            return response.sendResponse(res, response.build("USERNAME_EMPTY", { }) );
        } else if(!last_name){
            return response.sendResponse(res, response.build("LAST_NAME_EMPTY", { }) );
        } else if(!country_code){
            return response.sendResponse(res, response.build("COUNTRY_CODE_EMPTY", { }) );
        } else if(!users_mobile){
            return response.sendResponse(res, response.build("PHONE_EMPTY", { }) );
        } else if(!users_password){
            return response.sendResponse(res, response.build("PASSWORD_EMPTY", { }) );
        } else{
            
            next();
        }
    } catch (error) {
        return response.sendResponse(res, response.build("ERROR_TOKEN_REQUIRED", { error: 'Unauthorized Request' }) );
    }
}

exports.createOrder = async function (req, res, next) {
    try {
        const { product_id, qty, subtotal, total_price, ticket, device_type, app_version } = req.body;
        if(!isValidObjectId(product_id)){
            return response.sendResponse(res, response.build("PRODUCT_ID_EMPTY", { }) );
        } else if(!qty){
            return response.sendResponse(res, response.build("QTY_EMPTY", { }) );
        } else if(!subtotal){
            return response.sendResponse(res, response.build("SUBTOTAL_EMPTY", { }) );
        } else if(!total_price){
            return response.sendResponse(res, response.build("TOTAL_PRIZE_EMPTY", { }) );
        } else if(!ticket){
            return response.sendResponse(res, response.build("TICKET_EMPTY", { }) );
        } else{
            next();
        }
    } catch (error) {
        console.log('error',error);
        return response.sendResponse(res, response.build("ERROR_TOKEN_REQUIRED", { error: 'Unauthorized Request' }) );
    }
}
exports.checkThirdPartyAPIKey = async function (req, res, next) {
    const {key} = req.headers;
    if(key === 'd42a0d190464a2be90977c3996382811'){
        next();
    }else{
        return response.sendResponse(res, response.build("ERROR_TOKEN_REQUIRED", { error: 'Unauthorized Request' }) );
    }
}




