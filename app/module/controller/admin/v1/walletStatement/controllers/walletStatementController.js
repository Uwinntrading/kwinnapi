const response = require("../../../../../../util/response");
const { getIpAddress, stringToObjectId } = require("../../../../../../util/utility");
const {isValidObjectId} = require("../../../../../../util/valueChecker");
const lottoWinnerService = require("../../../../../services/loadbalanceServices");
const counterServices = require("../../../../../services/counterService");
const XLSX = require('xlsx');
/*********************************************************************************
 * Function Name    :  list
 * Purpose          :  This function is  ot get winner statement list
 * Created By       :  Dilip Halder
 * Created Data     :  20-02-2025
 ********************************************************************************/
exports.list = async function (req, res) {
    try {
        const usrId = req.user.userId;
        if(!isValidObjectId(usrId)){
            return response.sendResponse(res, response.build('PERMISSION_ERROR', { }));
        } else{
            const { condition={}, select ={}, limit, skip, sort={}, type } = req.body;
            let listWhere = {
                ...(type?{type:type}:null),
                condition : { ...condition },
                ...(sort? {sort : sort}:{sort : { _id : -1}}),
                ...(select? {select : select}:null),
                ...(limit?{limit : limit}: 0),
                ...(skip?{skip : skip}: 0)
            }
            const result = await lottoWinnerService.select(listWhere);
            if (result && type !== "single") {
                const countOption = {
                    type: "count",
                    condition : { ...condition },
                };
                const count = await lottoWinnerService.select(countOption);
                return response.sendResponse(res, response.build("SUCCESS", { ...{ count: count }, result }));
            } else {
                return response.sendResponse(res, response.build("SUCCESS", { ...{ count: 0 }, result }));
            }
        }
    } catch (error) {
        console.log('error', error)
        return response.sendResponse( res, response.build("ERROR_SERVER_ERROR", { error }));
    }
}

/*********************************************************************************
 * Function Name    :  history
 * Purpose          :  This function is  ot get winner statement list
 * Created By       :  Dilip Halder
 * Created Data     :  20-02-2025
 ********************************************************************************/
exports.history = async function (req, res) {
    try {
        const usrId = req.user.userId;
        if(!isValidObjectId(usrId)){
            return response.sendResponse(res, response.build('PERMISSION_ERROR', { }));
        } else{
            const { condition={}, select ={}, limit, skip, sort={}, type } = req.body;
            let listWhere = {
                ...(type?{type:type}:null),
                condition : { ...condition },
                ...(sort? {sort : sort}:{sort : { _id : -1}}),
                ...(select? {select : select}:null),
                ...(limit?{limit : limit}: 0),
                ...(skip?{skip : skip}: 0)
            }
            const result = await lottoWinnerService.select_point_txn(listWhere);
            if (result && type !== "single") {
                const countOption = {
                    type: "count",
                    condition : { ...condition },
                };
                const count = await lottoWinnerService.select_point_txn(countOption);
                return response.sendResponse(res, response.build("SUCCESS", { ...{ count: count }, result }));
            } else {
                return response.sendResponse(res, response.build("SUCCESS", { ...{ count: 0 }, result }));
            }
        }
    } catch (error) {
        console.log('error', error)
        return response.sendResponse( res, response.build("ERROR_SERVER_ERROR", { error }));
    }
}

/*********************************************************************************
 * Function Name    :   update
 * Purposs          :   This function is used update data
 * Created By       :   Dilip Halder
 * Created Data     :   08 April 2025
 **********************************************************************************/
exports.update = async function (req, res) {
    try {  

        console.log(req.body)

        // Destructure the request body
        const {  id , status   } = req.body;

        const options = {
            condition: {
                _id: id,
            },
            data: {
                ...(status ? { status: status } : ''),
            },
        };

        const UpdatedResponse = await lottoWinnerService.updateData(options);
        if(UpdatedResponse){
            return response.sendResponse(res, response.build('SUCCESSFULLY_UPDATED',{ result :UpdatedResponse} ));
        }else{
            return response.sendResponse(res, response.build('ERROR_DATA_NOT_FOUND',{ result :[]} ));

        }
    } catch (error) {
        // Catch any errors and log them, then send an error response
        console.log('error', error);
        return response.sendResponse(res, response.build('ERROR_SERVER_ERROR', { error }));
    }
};

