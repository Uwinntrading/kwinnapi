const response = require("../../../../../util/response");
const counterServices = require("../../../../services/counterService");
const {isValidObjectId} = require("../../../../../util/valueChecker");
const {getIpAddress} = require("../../../../../util/utility");
const generalServices = require("../../../../services/crm/commonServices");
const { createLogs } = require("../../../../../util/logger");
/*********************************************************************************
 * Function Name    :   getGeneralData
 * Purpose          :   This function is used for list of general data
 * Created By       :   Afsar Ali
 * Created Data     :   28-05-2025
 * Updated By       :   
 * Update Data      :
 ********************************************************************************/
exports.getGeneralData = async function (req, res) {
    try {
        let listWhere = {
           type : "single",
           condition : { status : "A" },
           sort : { _id : -1}
        }
        const result = await generalServices.selectGeneralData(listWhere);
        return response.sendResponse(res, response.build("SUCCESS", { result }));
    } catch (error) {
        console.log('error :', error);
        return response.sendResponse(res, response.build('ERROR_SERVER_ERROR', { error }));
    }
}; //End of Function

/*********************************************************************************
 * Function Name    :   addEditData
 * Purpose          :   This function is used for list of general data
 * Created By       :   Afsar Ali
 * Created Data     :   28-05-2025
 * Updated By       :   
 * Update Data      :
 ********************************************************************************/
exports.addEditData = async function (req, res) {
    try {
        const email = req.user.email;
        const { analyser_start_time, analyser_end_time, invoice_start_time, invoice_end_time } =req.body;
        let options = {
           type : "single",
           condition : { status : "A" },
           select : {_id : true},
           sort : { _id : -1}
        }
        const data = await generalServices.updateGeneralData(options);
        if(data && isValidObjectId(data?._id)){
            const updateParam = {
                condition : { _id : data?._id },
                data : {
                    analyser_start_time : analyser_start_time, 
                    analyser_end_time : analyser_end_time, 
                    invoice_start_time : invoice_start_time, 
                    invoice_end_time : invoice_end_time,
                }
            }
            const result = await generalServices.updateGeneralData(updateParam);
            createLogs(req, `${email} update general data.`,updateParam?.data);
            return response.sendResponse(res, response.build("SUCCESS", { result }));
        } else {
            return response.sendResponse(res, response.build("ERROR_DATA_NOT_FOUND", { }));
        }
    } catch (error) {
        console.log('error :', error);
        return response.sendResponse(res, response.build('ERROR_SERVER_ERROR', { error }));
    }
}; //End of Function