const constant      = require('../config/constant');
module.exports = async function authorize(req, res, next) {
    const {key} = req.headers;
    
    if(key === constant.apikey){
        next();
    }else{
        return response.sendResponse(res, response.build("ERROR_TOKEN_REQUIRED", { error: 'Unauthorized Request' }) );
    }
};