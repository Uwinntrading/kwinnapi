const response = require("../../../../../util/response");
const {isValidObjectId} = require("../../../../../util/valueChecker");
const { getLogs, createLogs } = require("../../../../../util/logger");
const moment = require("moment");
/*********************************************************************************
 * Function Name    :   list
 * Purpose          :   This function is get log list
 * Created By       :   Afsar Ali
 * Created Data     :   23-06-2025
 * Updated By       :
 * Update Data      :
 ********************************************************************************/
exports.list = async function (req, res) {
    try {
        const usrId = req.user.userId;
        const { date }= req.body;
        if(!isValidObjectId(usrId)){
            return response.sendResponse(res, response.build('PERMISSION_ERROR', { }));
        } else{
            const result =await  getLogs(moment(date || new Date()).format('YYYY_MM_DD'));
            if(result?.length > 0){
                return response.sendResponse(res, response.build("SUCCESS", { result }));
            } else{
                return response.sendResponse(res, response.build("SUCCESS", { result : [] }));
            }
        }
    } catch (error) {
        console.log('error', error)
        return response.sendResponse( res, response.build("ERROR_SERVER_ERROR", { error }));
    }
}

/*********************************************************************************
 * Function Name    :   create
 * Purpose          :   This function is create log list
 * Created By       :   Afsar Ali
 * Created Data     :   28-06-2025
 * Updated By       :
 * Update Data      :
 ********************************************************************************/
exports.create = async function (req, res) {
    try {
        const usrId = req.user.userId;
        const {log, payload}= req.body;
        if(!isValidObjectId(usrId)){
            return response.sendResponse(res, response.build('PERMISSION_ERROR', { }));
        } else if(!log){
            return response.sendResponse(res, response.build('PERMISSION_ERROR', { }));
        } else{
            createLogs(req, log, payload || {});
            return response.sendResponse(res, response.build("SUCCESS", { }));
        }
    } catch (error) {
        console.log('error', error)
        return response.sendResponse( res, response.build("ERROR_SERVER_ERROR", { error }));
    }
}