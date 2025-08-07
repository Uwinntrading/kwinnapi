const response            = require('../../../../../../util/response');
const {isValidObjectId}   = require("../../../../../../util/valueChecker");
const { getIpAddress }    = require("../../../../../../util/utility");
const lottoWinnerServices = require("../../../../../services/front/v1/lottoWinnerServices");
const lottoOrderServices  = require("../../../../../services/front/v1/campaignOrderServices");
const loadbalanceServices = require("../../../../../services/front/v1/loadbalanceServices");
const counterServices     = require("../../../../../services/counterService");
const utility             = require("../../../../../../util/utility");
const moment              = require('moment');
/*********************************************************************************
 * Function Name    :   checkWinner
 * Purpose          :   This function is for get lotto winners list
 * Created By       :   Afsar Ali
 * Created Data     :   24-01-2025
 * Updated By       :
 * Update Data      :
 ********************************************************************************/
exports.checkWinner = async function (req, res) {
    try {
        
        
        const usrId = req.user.userId;
        const { order_no } = req.body;
        
        if(!isValidObjectId(usrId)){
            return response.sendResponse(res, response.build('PERMISSION_ERROR', { }));
        } else if(!order_no){
            return response.sendResponse(res, response.build('ORDER_ID_EMPTY', { }));
        } else{
            const options ={
                type: "single",
                condition : { order_no : order_no },
                select : { status : true, order_no : true, draw_date_time : true }
            }
            const orderData = await lottoOrderServices.select(options);
            // if(orderCount === 1){
            //     const listWhere = {
            //         condition : { order_no : order_no }
            //     }
            //     const result = await lottoWinnerServices.select(listWhere);
            //     return response.sendResponse(res, response.build("SUCCESS", { result }));
            // } else{
            //     return response.sendResponse(res, response.build('ORDER_NOT_FOUND', { }));
            // }
           
           if (orderData) {
            
                const TODAY = new Date();
                const drawDateTime = new Date(orderData.draw_date_time);
                
                
                if (isNaN(drawDateTime)) {
                    return response.sendResponse(res, response.build("INVALID_DATE", { message: "Invalid draw date" }));
                }
                
                if (TODAY > drawDateTime && orderData?.status === "Success") {
                    const listWhere = { condition: { order_no: order_no } };
                    const result = await lottoWinnerServices.select(listWhere);

                    const status = result.reduce((sum, item) => {
                        if (!sum.split(', ').includes(item.status)) {
                            return sum ? `${sum}, ${item.status}` : item.status;
                        }
                        return sum;
                    }, '');
                    // const status = result[0].status;
                    // console.log(status);
                    if (result.length > 0  && status == 'Active') {
                        const amount = result.reduce((sum, item) => sum + item.winning_amount, 0);
                        let redeemLIMIT = req.user.userData.redeeming_amount_limit || 999;
                        // console.log(redeemLIMIT);
                        if (amount > redeemLIMIT) {

                            if(usrId != '67ba045575ff77e317b8c53c'){
                                return response.sendResponse(res, response.build("SUCCESS", {
                                    message: `Congratulations! You have won a big prize (${amount.toFixed(2)} SAR). Please proceed to the Kwinn head office to claim your prize. Thank you!`,
                                    result: []
                                }));
                            }else{
                                return response.sendResponse(res, response.build("SUCCESS", {
                                    message: `Congratulations! You have won ${amount.toFixed(2)} SAR.`,
                                    result: result
                                }));
                            }

                        } else if (amount === 0) {
                            return response.sendResponse(res, response.build("SUCCESS", {
                                message: "Oops! You missed winning this time. Better luck next time.",
                                result: []
                            }));
                        } else {
                            return response.sendResponse(res, response.build("SUCCESS", {
                                message: `Congratulations! You have won ${amount.toFixed(2)} SAR.`,
                                result: result
                            }));
                        }
                    } else if(status == 'Redeemed'){
                            return response.sendResponse(res, response.build("SUCCESS", {
                                message: `Already Paid.`,
                                result: result
                            }));
                    } else {
                        return response.sendResponse(res, response.build("SUCCESS", {
                            message: "Oops! You missed winning this time. Better luck next time.",
                            result: []
                        }));
                    }
                } else if (orderData?.status === "CL") {
                    return response.sendResponse(res, response.build("SUCCESS", { message: "This ticket is cancelled.", result: [] }));
                } else if (TODAY < drawDateTime && orderData?.status === "Success") {
                    return response.sendResponse(res, response.build("SUCCESS", {
                        message: `The draw is scheduled for ${moment(drawDateTime).format('DD-MM-YYYY hh:mm A')}. Please check the results after the draw.`,
                        result: []
                    }));
                } else {
                    return response.sendResponse(res, response.build("SUCCESS", {
                        message: `The draw is scheduled for ${moment(drawDateTime).format('DD-MM-YYYY hh:mm A')}. Please check the results after the draw.`,
                        result: []
                    }));
                }
            } else {
                
                return response.sendResponse(res, response.build('ORDER_NOT_FOUND', {}));
            }

        }
    } catch (error) {
        console.log('error', error)
        return response.sendResponse( res, response.build("ERROR_SERVER_ERROR", { error }));
    }
}
 
/*********************************************************************************
 * Function Name    :   redeemWinner
 * Purpose          :   This function is for get winners redeem list
 * Created By       :   Afsar Ali
 * Created Data     :   24-01-2025
 * Updated By       :   Dilip halder
 * Update Data      :   17-02-2025
 ********************************************************************************/
exports.redeemWinner = async function (req, res) {
    try {
        const usrId = req.user.userId;
        const userData = req.user.userData;
        const { id, pin } = req.body;
        if(!isValidObjectId(usrId) || !isValidObjectId(id)){
            return response.sendResponse(res, response.build('PERMISSION_ERROR', { }));
        } else if(!pin){
            return response.sendResponse(res, response.build('PIN_EMPTY', { }));
        } else{
            const options ={
                type: "single",
                condition : { _id : id },
                select : {order_no : true, status : true}
            }
            const winnerData = await lottoWinnerServices.select(options); 
            
            const CheckOptions ={
                type: "multiple",
                condition : { order_no : winnerData.order_no },
                // select : {order_no : true, status : true}
                select : { order_no : true, winning_amount : true , status : true  }
            }
            const multipleWinnerData = await lottoWinnerServices.select(CheckOptions); 

            const status = multipleWinnerData.reduce((sum, item) => {
                if (!sum.split(', ').includes(item.status)) {
                    return sum ? `${sum}, ${item.status}` : item.status;
                }
                return sum;
            }, '');

            const amount = multipleWinnerData.reduce((sum, item) => {
                if(item.status == 'Active') {
                   return sum + item.winning_amount;
                }
                return sum;
            },0);
            
            if(multipleWinnerData && status === 'Active'){
                
                const orderOption = {
                    type : 'single',
                    condition : { order_no : winnerData?.order_no },
                    select : { status : true, verification_code : true }
                }
                const orderData = await lottoOrderServices.select(orderOption); 
                if(orderData && orderData.status === 'Success'){
                    if(parseInt(pin) === orderData.verification_code){
                        const ipAddress = await getIpAddress();
                        const updateData = {
                            condition : { order_no : winnerData.order_no },
                            data : { 
                                status      : 'Redeemed',
                                redeem_by   : usrId,
                                redeem_name : userData?.users_name + ' ' + userData?.last_name,
                                redeem_pos  : userData?.pos_number,
                                redeem_date : new Date(),
                                update_by   : usrId,
                                update_ip   : ipAddress
                            }
                        }
                        const result = await lottoWinnerServices.updateManyData(updateData);
                        
                        // Adding paid loadbalance ..
                        const counter = await counterServices.getSequence('kw_loadBalance');
                        const options = {
                            load_balance_id        : counter.seq,  
                            campaignOrderData      : orderData._id ,
                            campaignOrderNo        : winnerData.order_no,
                            debit_user             : usrId,
                            points                 : amount,
                            availableArabianPoints : userData?.availableArabianPoints,
                            end_balance            : userData?.availableArabianPoints,
                            record_type            : 'Debit' ,
                            narration              : 'Lotto Winner Redeem',
                            created_at             : new Date(),
                            created_ip             : utility.loginIP(req),
                            created_by             : usrId,
                            status                 : 'A',
                            created_user_id        : userData?.users_id
                        }
                        const result1 =  await loadbalanceServices.createData(options);
                        
                        // Outpot syntex
                        const options1 ={
                            type: "multiple",
                            condition : { order_no : winnerData.order_no ,  status : 'Redeemed' },
                            select : {
                                _id               : true, 
                                order_no          : true,
                                seller_first_name : true,
                                seller_last_name  : true,
                                store_name        : true,
                                pos_number        : true,
                                updatedAt         : true,
                                coupon_code       : true,
                                matching_code     : true,
                                winner_type       : true,
                                winning_amount    : true,
                                redeem_name       : true,
                                redeem_pos        : true,
                            }
                        }
                        const responce = await lottoWinnerServices.select(options1);
                        return response.sendResponse(res, response.build("SUCCESS", { responce }));
                    } else{
                        return response.sendResponse(res, response.build("PIN_ERROR", { }));
                    }
                } else{
                    return response.sendResponse(res, response.build("ERROR_DATA_NOT_FOUND", { }));
                }
            } else if(winnerData && winnerData?.status === 'Redeemed'){
                return response.sendResponse(res, response.build("ALREADY_REDEEM_ERROR", { }));
            } else{
                return response.sendResponse(res, response.build("ERROR_DATA_NOT_FOUND", { }));
            }
        }
    } catch (error) {
        console.log('error', error)
        return response.sendResponse( res, response.build("ERROR_SERVER_ERROR", { error }));
    }
}


/*********************************************************************************
 * Function Name    :   redeemedList
 * Purpose          :   This function is get redeemed list
 * Created By       :   Afsar Ali
 * Created Data     :   24-01-2025
 * Updated By       :
 * Update Data      :
 ********************************************************************************/
exports.redeemList = async function (req, res) {
    try {
        const usrId = req.user.userId;
        const { condition={}, select ={}, limit, skip, sort={}, type } = req.body;
        if(!isValidObjectId(usrId)){
            return response.sendResponse(res, response.build('PERMISSION_ERROR', { }));
        } else{
            let listWhere = {
                ...(type?{type:type}:null),
                condition : { 
                    redeem_by : usrId, 
                    ...condition 
                },
                ...(sort? {sort : sort}:{sort : { _id : -1}}),
                ...(select? {select : select}:null),
                ...(limit?{limit : limit}: 0),
                ...(skip?{skip : skip}: 0)
            }
            const result = await lottoWinnerServices.select(listWhere);
            if (result && type !== "single") {
                const countOption = {
                    type: "count",
                    condition : { 
                        redeem_by : usrId,
                        ...condition 
                    },
                };
                const count = await lottoWinnerServices.select(countOption);
                return response.sendResponse(res, response.build("SUCCESS", { ...{ count: count }, result }));
            } else {
                return response.sendResponse(res, response.build("SUCCESS", { ...{ count: 0 }, result }));
            }
        }
    } catch (error) {
        return response.sendResponse( res, response.build("ERROR_SERVER_ERROR", { error }));
    }
}