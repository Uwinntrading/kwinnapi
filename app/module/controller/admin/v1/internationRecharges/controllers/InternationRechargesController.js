const counter = require("../../../../../../models/counter");
const response         = require("../../../../../../util/response");
const utility          = require('../../../../../../util/utility');
const {isValidObjectId}          = require('../../../../../../util/valueChecker');
const counterService   = require('../../../../../services/counterService');
const imageHandler     = require("../../../../../../util/imageHandler");
const Services         = require("../../../../../services/admin/v1/recharge/InternationRechargesServices");
const moment           = require("moment"); 
 
/*********************************************************************************
 * Function Name    :   list
 * Purposs          :   This function is used to add data
 * Created By       :   Dilip Halder
 * Created Data     :   23 October 2024
 **********************************************************************************/
 exports.list = async function (req, res) {
    try {
        const { condition={}, select ={}, sort={}, type, skip, limit }=req.body;

        let listWhere = {
            ...(condition? {condition : { ...condition }}:null),
            ...(sort? {sort : sort}:null),
            ...(select? {select : select}:null),
            ...(type?{type:type}:null),
            ...(skip?{skip:skip}:null),
            ...(limit?{limit:limit}:{limit : 10}),
        }
        const result = await Services.selectWithPopulate(listWhere);
        if(type == "count" && result == "" ){
            return response.sendResponse(res, response.build('SUCCESS',{ result : 0 } ));
        }else if(result != ''){
            return response.sendResponse(res, response.build('SUCCESS',{ result :result } ));
        }else{
            return response.sendResponse(res, response.build('ERROR_DATA_NOT_FOUND',{ result :[]} ));
        } 
        
    } catch (error) {
        console.log('error',error)
        return response.sendResponse(res, response.build('ERROR_SERVER_ERROR', { error }));
    }
}; //End of Function

/*********************************************************************************
 * Function Name    :   Update
 * Purposs          :   This function is used update data
 * Created By       :   Dilip Halder
 * Created Data     :   23 October 2024
 **********************************************************************************/
exports.update = async function (req, res) {
    try {
        //  Destructure the request body
        const { id, status } = req.body;
        // Image uploading section end here
        const options = {
            condition: {
                _id: id
            },
            data: {
                ...(status ? { status: status } : ''),
                updated_ip: utility.loginIP(req),
                updated_by: utility.AdminUserID(req)
            }
        }

        const UpdatedResponse = await Services.updateData(options);
        if (UpdatedResponse) {
            return response.sendResponse(res, response.build('SUCCESSFULLY_UPDATED', { result: UpdatedResponse }));
        } else {
            return response.sendResponse(res, response.build('ERROR_DATA_NOT_FOUND', { result: [] }));
        }

    } catch (error) {
        // Catch any errors and log them, then send an error response
        console.log('error', error);
        return response.sendResponse(res, response.build('ERROR_SERVER_ERROR', { error }));
    }
};

/*********************************************************************************
 * Function Name    :   statisticsReports
 * Purpose          :   This function is used for campaign orders statistics reports
 * Created By       :   Afsar Ali
 * Created Data     :   12-04-2025
 * Updated By       :
 * Update Data      :
 ********************************************************************************/
exports.statisticsReports = async function (req, res) {
    try {
        const usrId = req.user.userId;
        let { startDate, endDate } = req.body;
        let start_date, end_date;
        if(!isValidObjectId(usrId)){
            return response.sendResponse(res, response.build('PERMISSION_ERROR', { }));
        } else{
            if(!startDate || !endDate){
                start_date = moment().format('YYYY-MM-DD HH:mm:00');  
                end_date = moment().format('YYYY-MM-DD HH:mm:00');
            } else{
                start_date = moment(startDate).format('YYYY-MM-DD HH:mm:00');  
                end_date = moment(endDate).format('YYYY-MM-DD HH:mm:00');
            }

            const pipeline = [
                {
                    $match: { 
                        createdAt: { $gte: new Date(`${start_date}`), $lte: new Date(`${end_date}`)},
                        status : {$ne : "Failed"}
                    }
                },
                {
                    $group: {
                        _id: { $hour: "$createdAt" },
                        count: { $sum: 1 },
                        total_points: { $sum: '$markUpValue' }
                    }
                },
                { $sort: { "_id": 1 } }
            ];
            // console.log(JSON.stringify(pipeline));
            const result = await Services.rechargeAggregate(pipeline);
            return response.sendResponse(res, response.build("SUCCESS", { result }));
        }
    } catch (error) {
        console.log('error',error);
        return response.sendResponse( res, response.build("ERROR_SERVER_ERROR", { error }));
    }
}