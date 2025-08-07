const response = require("../../../../../../util/response");
const { getIpAddress } = require("../../../../../../util/utility");
const {isValidObjectId} = require("../../../../../../util/valueChecker");
const orderService = require('../../../../../services/admin/v1/campaign/campaignOrderServices')
const orderTicketServices = require('../../../../../services/admin/v1/campaign/campaignTicketsServices');
const counterServices = require("../../../../../services/counterService");
const loadbalanceServices = require("../../../../../services/loadbalanceServices");
const userServices = require('../../../../../services/admin/v1/campaign/accountsService');
const moment= require("moment");
/*********************************************************************************
 * Function Name    :   list
 * Purpose          :   This function is get campaign list
 * Created By       :   Afsar Ali
 * Created Data     :   08-01-2025
 * Updated By       :
 * Update Data      :
 ********************************************************************************/
exports.list = async function (req, res) {
    try {
        const usrId = req.user.userId;
        const { condition={}, select ={}, limit, skip, sort={}, type } = req.body;  
        if(!isValidObjectId(usrId)){
            return response.sendResponse(res, response.build('PERMISSION_ERROR', { }));
        } else{
            let listWhere = {
                ...(type?{type:type}:null),
                condition : { ...condition },
                ...(sort? {sort : sort}:{sort : { _id : -1}}),
                ...(select? {select : select}:null),
                ...(limit?{limit : limit}: 0),
                ...(skip?{skip : skip}: 0)
            }
            const result = await orderService.select_details(listWhere);
            if (result && type !== "single") {
                const countOption = {
                    type: "count",
                    condition : { ...condition },
                };
                const count = await orderService.select_details(countOption);
                return response.sendResponse(res, response.build("SUCCESS", { ...{ count: count }, result }));
            } else {
                return response.sendResponse(res, response.build("SUCCESS", { ...{ count: 0 }, result }));
            }
        }
    } catch (error) {
        return response.sendResponse( res, response.build("ERROR_SERVER_ERROR", { error }));
    }
}

/*********************************************************************************
 * Function Name    :   cancelOrder
 * Purpose          :   This function is used for cancel campaign orders
 * Created By       :   Afsar Ali
 * Created Data     :   16-01-2025
 * Updated By       :
 * Update Data      :
 ********************************************************************************/
exports.cancelOrder = async function (req, res) {
    try {
        const usrId = req.user.userId;
        const { order_id } = req.body;  
        if(!isValidObjectId(usrId) || !isValidObjectId(order_id)){
            return response.sendResponse(res, response.build('PERMISSION_ERROR', { }));
        } else{
            const orderData = await orderService.getDataById(order_id);
            if(orderData){
                const ipAddress = await getIpAddress();
                //Update Order Status
                const updateOrderOption = {
                    condition : { _id : order_id },
                    data : {
                        status      : "Cancel",
                        update_ip   : ipAddress,
                        update_by   : usrId
                    }   
                }
                await orderService.updateData(updateOrderOption);
                //Update Tickets Status
                const updateTicketOption = {
                    condition : { order_id : orderData?._id },
                    data : { 
                        status      : "Cancel",
                        update_ip   : ipAddress,
                        update_by   : usrId
                     }
                }
                await orderTicketServices.updateData(updateTicketOption);

                //Credit point to user
                const debitOption = {
                    type : "single",
                    condition : { campaignOrderData :  order_id, record_type : "Debit", narration : "Campaign Purchase" }
                }
                const debitData = await loadbalanceServices.select_point_txn(debitOption);
                if(debitData && debitData?.status === "A"){
                    let end_balance = parseFloat(debitData?.debit_user?.availableArabianPoints) + parseFloat(debitData?.points)
                    const seq_id = await counterServices.getSequence('kw_loadBalance');
                    const creditParam = {
                        load_balance_id         : seq_id,
                        campaignOrderData       : order_id,
                        campaignOrderNo         : debitData?.campaignOrderNo,
                
                        credit_user             : debitData?.debit_user,
                        debit_user              : null,
                        points                  : debitData.points,
                        availableArabianPoints  : debitData?.debit_user?.availableArabianPoints,
                        end_balance             : end_balance,
                        record_type             : "Credit",
                        narration               : 'Campaign Purchase Cancel',
                        
                        creation_ip             : ipAddress,
                        created_at              : new Date(),
                        created_by              : usrId,
                        status                  : "A"
                    }
                    const Credit = await loadbalanceServices.createData(creditParam);
                    if(Credit){
                        const avlCreditPoints   = end_balance;
                        const totalCreditPoint  = debitData?.debit_user?.totalArabianPoints + debitData?.points;
                        const updateParam1 = {
                            condition : { _id : debitData?.debit_user?._id },
                            data : { 
                                availableArabianPoints : avlCreditPoints,
                                totalArabianPoints : totalCreditPoint,
                                updated_by : usrId,
                                updated_ip : ipAddress
                            }
                        }
                        await userServices.users_updateData(updateParam1);
                    }

                }

                //Debit point to user
                const creditOption = {
                    type : "single",
                    condition : { campaignOrderData :  order_id, record_type : "Credit", narration : "Campaign commission" }
                }
                const creditData = await loadbalanceServices.select_point_txn(creditOption);
                if(creditData && creditData?.status === "A"){
                    let end_balance = parseFloat(creditData?.credit_user?.availableArabianPoints) - parseFloat(creditData?.points)
                    const seq_id = await counterServices.getSequence('kw_loadBalance');
                    const debitParam = {
                        load_balance_id         : seq_id,
                        campaignOrderData       : order_id,
                        campaignOrderNo         : creditData?.campaignOrderNo,
                
                        credit_user             : null,
                        debit_user              : creditData?.credit_user,
                        points                  : creditData.points,
                        availableArabianPoints  : creditData?.credit_user?.availableArabianPoints,
                        end_balance             : end_balance,
                        record_type             : "Debit",
                        narration               : 'Campaign Commission Reverse',
                        
                        creation_ip             : ipAddress,
                        created_at              : new Date(),
                        created_by              : usrId,
                        status                  : "A"
                    }
                    const Credit = await loadbalanceServices.createData(debitParam);
                    if(Credit){
                        const avlCreditPoints   = end_balance;
                        const totalCreditPoint  = creditData?.credit_user?.totalArabianPoints + creditData?.points;
                        const updateParam1 = {
                            condition : { _id : creditData?.credit_user?._id },
                            data : { 
                                availableArabianPoints : avlCreditPoints,
                                totalArabianPoints : totalCreditPoint,
                                updated_by : usrId,
                                updated_ip : ipAddress
                            }
                        }
                        await userServices.users_updateData(updateParam1);
                    }
                }
                return response.sendResponse(res, response.build("SUCCESS", { }));
            } else{
                return response.sendResponse(res, response.build("ERROR_DATA_NOT_FOUND", { }));
            }        
            
        }
    } catch (error) {
        console.log('error',error);
        return response.sendResponse( res, response.build("ERROR_SERVER_ERROR", { error }));
    }
}

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
        const emailId = req.user.email;
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
                        status : 'Success'
                    }
                },
                {
                    $group: {
                        _id: { $hour: "$createdAt" },
                        count: { $sum: 1 },
                        total_points: { $sum: '$total_points' }
                    }
                },
                { $sort: { "_id": 1 } }
            ];
            // console.log(JSON.stringify(pipeline));
            const result = await orderService.orderAggregate(pipeline);
            return response.sendResponse(res, response.build("SUCCESS", { result }));
        }
    } catch (error) {
        console.log('error',error);
        return response.sendResponse( res, response.build("ERROR_SERVER_ERROR", { error }));
    }
}
