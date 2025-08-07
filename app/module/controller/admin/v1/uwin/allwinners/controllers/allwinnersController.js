const counter        = require("../../../../../../../models/counter");
const response       = require("../../../../../../../util/response");
const utility        = require('../../../../../../../util/utility');
const Services       = require("../../../../../../services/admin/v1/uwin/WinnerServices");
const counterService = require('../../../../../../services/counterService');
const imageHandler   = require("../../../../../../../util/imageHandler");

/*********************************************************************************
* Function Name    :   Add
* Purposs          :   This function is used to add data
* Created By       :   Dilip Halder
* Created Data     :   23 October 2024
**********************************************************************************/
exports.add = async function (req, res) {
    try {
        // Extract batchData from request body
        const { batchData } = req.body;
        const batchItems = JSON.parse(batchData);
        
        const options = [];
        for (const item of batchItems) {
            const counter = await counterService.getSequence('kw_winner');
            options.push({
                seq_id              : counter.seq,
                batch_id            : item.batch_id,
                file                : item.file,
                order_no            : item.order_no,
                seller_first_name   : item.seller_first_name,
                seller_last_name    : item.seller_last_name,
                seller_mobile       : item.seller_mobile,
                seller_mobile       : item.seller_mobile,
                coupon_code         : item.coupon_code,
                matching_code       : item.matching_code,
                straight_amount     : item.straight_amount,
                rumble_amount       : item.rumble_amount,
                chance_amount       : item.chance_amount,
                winner_type         : item.winner_type,
                winning_amount      : item.winning_amount,
                store_name          : item.store_name,
                pos_number          : item.pos_number,
                created_date        : item.created_date,
                status              : "Active",
                created_ip          : utility.loginIP(req),
                created_by          : utility.AdminUserID(req),
            });
        }
        // Log the complete options array
        const result = await Services.create(options);
        if (result) {
            return response.sendResponse(res, response.build('SUCCESS', { result: result }));
        }
        // Perform further operations with the options array if needed
    } 
    catch (error) {
        console.log(error)
        if (error.code === 11000) {
            return response.sendResponse(res, response.build('ERROR_DUPLICATE_DEPARTMENT', {
                error: 'Category name already exists',
                details: error.message
            }));
        }
        // Log any other errors and send a generic server error response
        // console.log('error', error);
        return response.sendResponse(res, response.build('ERROR_SERVER_ERROR', { error }));
    }
};

/*********************************************************************************
 * Function Name    :   Update
 * Purposs          :   This function is used update data
 * Created By       :   Dilip Halder
 * Created Data     :   23 October 2024
 **********************************************************************************/
exports.update = async function (req, res) {
    try {
        //  Destructure the request body
        const {  id, status} = req.body;
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
 * Function Name    :   delete
 * Purposs          :   This function is used to delete data
 * Created By       :   Dilip Halder
 * Created Data     :   23 October 2024
 **********************************************************************************/
exports.delete = async function (req, res) {
    try {

        const { id, batch_id } = req.body
        const options = { 
            ...(id?{_id : id}:''),
            ...(batch_id?{batch_id : batch_id}:''),
        }
        const UpdatedResponse = await Services.deleteData(options);
        if (UpdatedResponse) {
            return response.sendResponse(res, response.build('SUCCESSFULLY_DELETED', { result: [] }));
        }
    } catch (error) {
        // Catch any errors and log them, then send an error response
        return response.sendResponse(res, response.build('ERROR_SERVER_ERROR', { error }));
    }
}

/*********************************************************************************
* Function Name    :   list
* Purposs          :   This function is used to add data
* Created By       :   Dilip Halder
* Created Data     :   23 October 2024
**********************************************************************************/
exports.list = async function (req, res) {
    try {
        const { condition = {}, select = {}, sort = {}, type, skip, limit } = req.body;
        let listWhere = {
            ...(condition ? { condition: { ...condition } } : null),
            ...(sort ? { sort: sort } : null),
            ...(select ? { select: select } : null),
            ...(type ? { type: type } : null),
            ...(skip ? { skip: parseInt(skip) } : null),
            ...(limit ? { limit: parseInt(limit) } : { limit: 10 }),

        }
        // console.log('listWhere : ', listWhere);
        const result = await Services.winnerList(listWhere);
        if (type == "count" && result == "") {
            return response.sendResponse(res, response.build('SUCCESS', { result: 0 }));
        } else if (result != '') {
            return response.sendResponse(res, response.build('SUCCESS', { result: result }));
        } else {
            return response.sendResponse(res, response.build('ERROR_DATA_NOT_FOUND', { result: [] }));
        }

    } catch (error) {
        console.log('error', error)
        return response.sendResponse(res, response.build('ERROR_SERVER_ERROR', { error }));
    }
}; //End of Function

/*********************************************************************************
* Function Name    : batchlist
* Purposs          : This function is used to add data
* Created By       : Dilip Halder
* Created Data     : 13 February 2024
**********************************************************************************/
exports.batchlist = async function (req, res) {
    try {
        const { condition = {}, select = {}, sort = {}, type, skip, limit , filters } = req.body;
        let listWhere = {
            ...(condition ? { condition: { ...condition } } : null),
            ...(sort ? { sort: sort } : null),
            ...(select ? { select: select } : null),
            ...(type ? { type: type } : null),
            ...(skip ? { skip: parseInt(skip) } : null),
            ...(limit ? { limit: parseInt(limit) } : { limit: 10 }),
            ...(filters ? { filters: filters } : null),

        }
        const result = await Services.select(listWhere);
        if (type == "count" && result == "") {
            return response.sendResponse(res, response.build('SUCCESS', { result: 0 }));
        } else if (result != '') {
            return response.sendResponse(res, response.build('SUCCESS', { result: result }));
        } else {
            return response.sendResponse(res, response.build('ERROR_DATA_NOT_FOUND', { result: [] }));
        }

    } catch (error) {
        console.log('error', error)
        return response.sendResponse(res, response.build('ERROR_SERVER_ERROR', { error }));
    }
}; //End of Function

/*********************************************************************************
* Function Name    : batchupdate
* Purposs          : This function is used to update batch
* Created By       : Dilip Halder
* Created Data     : 13 February 2024
**********************************************************************************/
exports.batchupdate = async function (req, res) {
    
    try {
        //  Destructure the request body
        const {  batch_id, status, statusType ,redeem_by } = req.body;
        const options = {
            condition: {
                batch_id  :  batch_id,
                ...( redeem_by === false ?{redeem_by:{$exists : false}}:{redeem_by:{$exists : true}}),
                ...( status    ?{status:statusType} :'' ) 
            },
            data: {
                ...(status ? { status: status } : ''),
                updated_ip: utility.loginIP(req),
                updated_by: utility.AdminUserID(req)
            }
        }
        
        const UpdatedResponse = await Services.updateByConditionData(options);
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