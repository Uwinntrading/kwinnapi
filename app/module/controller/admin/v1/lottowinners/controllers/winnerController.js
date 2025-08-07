const response = require("../../../../../../util/response");
const { getIpAddress, stringToObjectId } = require("../../../../../../util/utility");
const {isValidObjectId} = require("../../../../../../util/valueChecker");
const lottoWinnerService = require("../../../../../services/admin/v1/lottoWinnerServices");
const counterServices = require("../../../../../services/counterService");

const XLSX = require('xlsx');
/*********************************************************************************
 * Function Name    :   list
 * Purpose          :   This function is get lotto winner's list
 * Created By       :   Afsar Ali
 * Created Data     :   24-01-2025
 * Updated By       :
 * Update Data      :
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
 * Function Name    :   addeditdata
 * Purpose          :   This function is add/edit raffle winner data
 * Created By       :   Afsar Ali
 * Created Data     :   14-01-2025
 * Updated By       :
 * Update Data      :
 ********************************************************************************/
exports.uploadWinner = async function (req, res) {
    try {
        const usrId = req.user.userId;
        const fileBuffer = req.file?.buffer;
        const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const param = XLSX.utils.sheet_to_json(worksheet);
        if(!isValidObjectId(usrId)){
            return response.sendResponse(res, response.build('PERMISSION_ERROR', { }));
        } else if(!param || param.length === 0){
            return response.sendResponse(res, response.build('WINNER_LIST_EMPTY', { }));
        } else{
            const ipAddress = await getIpAddress();
            const seqData = await counterServices.getSequence('kw_lotto_winners');
            const processItems = param.map((items) => {
                try {
                    return {
                        batch_id          : seqData.seq,
                        order_no          : items["TICKET ID"],
                        seller_first_name : items['SELLER FIRST NAME'],
                        seller_last_name  : items['SELLER LAST NAME'],
                        seller_mobile     : items['SELLER MOBILE'],
                        coupon_code       : items['COUPONS'],
                        matching_code     : items['MATCHING NUMBER'],
                        straight_amount   : parseFloat(items['STRAIGHT AMOUNT'] || 0),
                        rumble_amount     : parseFloat(items['RUMBLE AMOUNT'] || 0),
                        chance_amount     : parseFloat(items['CHANCE AMOUNT'] || 0),
                        winner_type       : items['WINNER TYPE'],
                        winning_amount    : parseFloat(items['WINNING AMOUNT'] || 0),

                        file              : req?.file?.originalname || N/A,

                        status            : "Active",
                        created_by        : usrId,
                        created_ip        : ipAddress
                    };
                } catch (error) {
                    return null;
                }
            });
            
            const InsertData = await Promise.all(processItems);
            const validInsertData = InsertData.filter(item => item !== null && item !== undefined);
            if(validInsertData.length > 500){
                // Insert in chunks of 500
                const chunkSize = 500;
                for (let i = 0; i < validInsertData.length; i += chunkSize) {
                    const chunk = validInsertData.slice(i, i + chunkSize);
                    await lottoWinnerService.createData(chunk);
                }
            } else{
                await lottoWinnerService.createData(validInsertData);
            }
            return response.sendResponse(res, response.build("SUCCESS", {  }));
        }
    } catch (error) {
        console.log('error',error);
        return response.sendResponse( res, response.build("ERROR_SERVER_ERROR", { error }));
    }
}// End of function

/*********************************************************************************
 * Function Name    :   orderSummery
 * Purpose          :   This function is get lotto winner's summery list
 * Created By       :   Afsar Ali
 * Created Data     :   24-01-2025
 * Updated By       :
 * Update Data      :
 ********************************************************************************/
exports.orderSummery = async function (req, res) {
    try {
        const usrId = req.user.userId;
        if(!isValidObjectId(usrId)){
            return response.sendResponse(res, response.build('PERMISSION_ERROR', { }));
        } else{
            const { type='',condition={}, limit, skip } = req.body;
            let listWhere = {
                ...(type && {type : type,}),
                condition : { ...condition },
                ...(limit?{limit : limit}: 10),
                ...(skip?{skip : skip}: 0)
            }
            const result = await lottoWinnerService.summeryList(listWhere);

            if (result && type !== "single") {
                const countOption = {
                    type: "count",
                    condition : { ...condition },
                };
                const count = await lottoWinnerService.summeryList(countOption);
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
 * Function Name    :   batchChangeStatus
 * Purpose          :   This function is change status lotto winner
 * Created By       :   Afsar Ali
 * Created Data     :   24-01-2025
 * Updated By       :
 * Update Data      :
 ********************************************************************************/
exports.batchChangeStatus = async function (req, res) {
    try {
        const usrId = req.user.userId;
        const {ids_list, status}=req.body;
        if(!isValidObjectId(usrId)){
            return response.sendResponse(res, response.build('PERMISSION_ERROR', { }));
        } else if(!ids_list){
            return response.sendResponse(res, response.build('ID_ERROR', { }));
        } else if(ids_list && ids_list.length === 0){
            return response.sendResponse(res, response.build('ID_ERROR', { }));
        } else{
            const options = {
                type : 'count',
                condition : { batch_id : { $in : ids_list } }
            }
            const count = await lottoWinnerService.select(options);
            if(count > 0){
                const ipAddress = await getIpAddress();
                let updateParam = {
                    condition : { batch_id : { $in : ids_list } },      
                    data : { 
                        status      : status,
                        created_ip  : ipAddress,
                        created_by  : usrId
                    }
                }
                const result = await lottoWinnerService.updateManyData(updateParam);
                return response.sendResponse(res, response.build("SUCCESS", { }));
            } else{
                return response.sendResponse( res, response.build("ERROR_DATA_NOT_FOUND", {  }));
            }
        }
    } catch (error) {
        console.log('error', error)
        return response.sendResponse( res, response.build("ERROR_SERVER_ERROR", { error }));
    }
}

/*********************************************************************************
 * Function Name    :   batchDelete
 * Purpose          :   This function is change status lotto winner
 * Created By       :   Afsar Ali
 * Created Data     :   24-01-2025
 * Updated By       :
 * Update Data      :
 ********************************************************************************/
exports.batchDelete = async function (req, res) {
    try {
        const usrId = req.user.userId;
        const {ids_list}=req.body;
        if(!isValidObjectId(usrId)){
            return response.sendResponse(res, response.build('PERMISSION_ERROR', { }));
        } else if(!ids_list){
            return response.sendResponse(res, response.build('ID_ERROR', { }));
        } else if(ids_list && ids_list.length === 0){
            return response.sendResponse(res, response.build('ID_ERROR', { }));
        } else{
            const options = { batch_id : { $in : ids_list } }
            await lottoWinnerService.deleteManyData(options);
            return response.sendResponse(res, response.build("SUCCESS", { }));
        }
    } catch (error) {
        console.log('error', error)
        return response.sendResponse( res, response.build("ERROR_SERVER_ERROR", { error }));
    }
}

/*********************************************************************************
 * Function Name    :   changeStatus
 * Purpose          :   This function is change status lotto winner
 * Created By       :   Afsar Ali
 * Created Data     :   24-01-2025
 * Updated By       :
 * Update Data      :
 ********************************************************************************/
exports.changeStatus = async function (req, res) {
    try {
        const usrId = req.user.userId;
        const {id, status}=req.body;
        if(!isValidObjectId(usrId) || !isValidObjectId(id)){
            return response.sendResponse(res, response.build('PERMISSION_ERROR', { }));
        } else{
            const data = await lottoWinnerService.getDataById(id);
            if(data){
                const ipAddress = await getIpAddress();
                let updateParam = {
                    condition : { _id : id },      
                    data : { 
                        status      : status,
                        created_ip  : ipAddress,
                        created_by  : usrId
                    }
                }
                const result = await lottoWinnerService.updateData(updateParam);
                return response.sendResponse(res, response.build("SUCCESS", { }));
            } else{
                return response.sendResponse( res, response.build("ERROR_DATA_NOT_FOUND", {  }));
            }
        }
    } catch (error) {
        console.log('error', error)
        return response.sendResponse( res, response.build("ERROR_SERVER_ERROR", { error }));
    }
}

/*********************************************************************************
 * Function Name    :   delete
 * Purpose          :   This function is change status lotto winner
 * Created By       :   Afsar Ali
 * Created Data     :   24-01-2025
 * Updated By       :
 * Update Data      :
 ********************************************************************************/
exports.delete = async function (req, res) {
    try {
        const usrId = req.user.userId;
        const {id}=req.body;
        if(!isValidObjectId(usrId) || !isValidObjectId(id)){
            return response.sendResponse(res, response.build('PERMISSION_ERROR', { }));
        } else{
            const options = { _id : id }
            await lottoWinnerService.deleteData(options);
            return response.sendResponse(res, response.build("SUCCESS", { }));
        }
    } catch (error) {
        console.log('error', error)
        return response.sendResponse( res, response.build("ERROR_SERVER_ERROR", { error }));
    }
}


/*********************************************************************************
 * Function Name    :   bulkChangeStatus
 * Purpose          :   This function is change status lotto winner
 * Created By       :   Afsar Ali
 * Created Data     :   24-01-2025
 * Updated By       :
 * Update Data      :
 ********************************************************************************/
exports.bulkChangeStatus = async function (req, res) {
    try {
        const usrId = req.user.userId;
        const {ids_list, status}=req.body;
        if(!isValidObjectId(usrId)){
            return response.sendResponse(res, response.build('PERMISSION_ERROR', { }));
        } else{
            const options = {
                type : 'count',
                condition : {_id : {$in : ids_list}}
            }
            const data = await lottoWinnerService.select(options);
            if(data > 0){
                const ipAddress = await getIpAddress();
                let updateParam = {
                    condition : { _id : {$in : ids_list} },      
                    data : { 
                        status      : status,
                        created_ip  : ipAddress,
                        created_by  : usrId
                    }
                }
                const result = await lottoWinnerService.updateManyData(updateParam);
                return response.sendResponse(res, response.build("SUCCESS", { }));
            } else{
                return response.sendResponse( res, response.build("ERROR_DATA_NOT_FOUND", {  }));
            }
        }
    } catch (error) {
        console.log('error', error)
        return response.sendResponse( res, response.build("ERROR_SERVER_ERROR", { error }));
    }
}

/*********************************************************************************
 * Function Name    :   bulkDelete
 * Purpose          :   This function is change status lotto winner
 * Created By       :   Afsar Ali
 * Created Data     :   24-01-2025
 * Updated By       :
 * Update Data      :
 ********************************************************************************/
exports.bulkDelete = async function (req, res) {
    try {
        const usrId = req.user.userId;
        const {ids_list}=req.body;
        if(!isValidObjectId(usrId)){
            return response.sendResponse(res, response.build('PERMISSION_ERROR', { }));
        } else{
            const options = { _id : {$in : ids_list} }
            const result = await lottoWinnerService.deleteManyData(options);
            return response.sendResponse(res, response.build("SUCCESS", { }));
        }
    } catch (error) {
        console.log('error', error)
        return response.sendResponse( res, response.build("ERROR_SERVER_ERROR", { error }));
    }
}
