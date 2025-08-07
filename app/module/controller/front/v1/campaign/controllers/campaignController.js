const response = require('../../../../../../util/response');
const {isValidObjectId} = require("../../../../../../util/valueChecker");
const utility = require("../../../../../../util/utility");
const campaignServices = require("../../../../../services/front/v1/campaignServices");
const campaignOrderServices = require("../../../../../services/front/v1/campaignOrderServices");
const ticketServices = require("../../../../../services/front/v1/campaignTicketServices");
const userServices = require("../../../../../services/front/v1/userServices");
const loadbalanceServices = require("../../../../../services/front/v1/loadbalanceServices");
const counterServices = require("../../../../../services/counterService");
const moment = require('moment');
/*********************************************************************************
 * Function Name    :   getGeneralData
 * Purpose          :   This function is get campaign data
 * Created By       :   Afsar Ali
 * Created Data     :   10-01-2025
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
                condition : { 
                    ...condition ,
                    prizeData : {'$ne': null},
                    // draw_date_time : { '$gte' :  `${moment().format('YYYY-MM-DD')} 21:31:00` } ,
                    draw_date_time : { '$gte' :  `${moment().format('YYYY-MM-DD HH:mm')}` } ,
                    status : 'A' ,
                },
                ...(sort? {sort : { seq_order : 1} }:{sort : { seq_order : 1}}),
                ...(select? {select : select}:null),
                ...(limit?{limit : limit}: 0),
                ...(skip?{skip : skip}: 0)
            }
            const result = await campaignServices.select_details(listWhere);
            if (result && type !== "single") {
                const countOption = {
                    type: "count",
                    condition : { 
                        ...condition ,
                        prizeData : {'$ne': null},
                        draw_date_time : { '$gte' :  `${moment().format('YYYY-MM-DD HH:mm')}` } ,
                        status : 'A' ,
                    },
                };
                const count = await campaignServices.select_details(countOption);
                return response.sendResponse(res, response.build("SUCCESS", { ...{ count: count }, result }));
            } else {
                return response.sendResponse(res, response.build("SUCCESS", { ...{ count: 0 }, result }));
            }
        }
    } catch (error) {
        console.log('error',error);
        return response.sendResponse( res, response.build("ERROR_SERVER_ERROR", { error }));
    }
}

/*********************************************************************************
 * Function Name    :   getGlobalSetting
 * Purpose          :   This function is get campaign data
 * Created By       :   Afsar Ali
 * Created Data     :   10-01-2025
 * Updated By       :
 * Update Data      :
 ********************************************************************************/
exports.getGlobalSetting = async function (req, res) {
    try {
        const usrId = req.user.userId;
        if(!isValidObjectId(usrId)){
            return response.sendResponse(res, response.build('PERMISSION_ERROR', { }));
        } else{
            let listWhere = {
                type : "single",
                condition : { setting_type : "Global", status : "A" },
                sort : { _id : -1 }
            }
            const result = await campaignServices.select_setting(listWhere);
            return response.sendResponse(res, response.build("SUCCESS", { result }));
        }
    } catch (error) {
        console.log('error',error);
        return response.sendResponse( res, response.build("ERROR_SERVER_ERROR", { error }));
    }
}


/*********************************************************************************
 * Function Name    :   createOrder
 * Purpose          :   This function is create campaign order
 * Created By       :   Afsar Ali
 * Created Data     :   13-01-2025
 * Updated By       :
 * Update Data      :
 ********************************************************************************/
exports.createOrder = async function (req, res) {
    try {
        const usrId = req.user.userId;
        const userData = req.user.userData;
        const { campaign_id, straight={}, rumble={}, chance={}, tickets=[], total_qty, total_points ,prize } = req.body;
        if(!isValidObjectId(usrId)){
            return response.sendResponse(res, response.build('PERMISSION_ERROR', { }));
        } else if(!campaign_id){
            return response.sendResponse(res, response.build('CAMPAIGN_NOT_FOUND', { }));
        } else if(straight.qty === 0 && rumble.qty === 0 && chance.qty === 0){
            return response.sendResponse(res, response.build('QTY_EMPTY', { }));
        } else if(!tickets || tickets?.length === 0){
            return response.sendResponse(res, response.build('TICKET_ERROR', { }));
        } else if(total_points < 0 || userData?.availableArabianPoints < total_points ){
            return response.sendResponse(res, response.build('BALANCE_ERROR', { }));
        } else{
            const ipAddress = await utility.getIpAddress();
            const options = {
                type : 'single',
                condition : { _id : campaign_id, status : "A" }
            }
            const campaignData  = await campaignServices.select_details(options);
            const TODAY         = new Date();
            const drawDateTime  = new Date(campaignData.draw_date_time);
          
            if (isNaN(drawDateTime)) {
               return response.sendResponse(res, response.build("INVALID_DATE", { message: "Invalid draw date" }));
            }
            
            if(campaignData  && TODAY < drawDateTime){
                const order_no = await counterServices.getCampaignOrderNumber();
                const params = {
                    order_no                : order_no,
                    verification_code       : utility.verifyCode(),
                    campaign_title          : campaignData?.title,
                    campaign_data           : campaign_id,
                    seller_user_id          : usrId,
                    seller_first_name       : userData?.users_name,
                    seller_last_name        : userData?.last_name,
                    seller_mobile           : userData?.users_mobile,
                    seller_pos_number       : userData?.pos_number,

                    bind_person_name        : userData?.bind_person_name,
                    bind_person_mobile      : userData?.bind_person_mobile,
                    commission_percentage   : userData?.commission_percentage,
                    area                    : userData?.area,

                    ...(straight?.points > 0 && {
                        straight            : {
                            points      : straight.points || 0,
                            qty         : straight.qty || 0,
                            total_points: straight?.points * straight?.qty
                        }
                    }),

                    ...(rumble?.points > 0 && {
                        rumble            : {
                            points      : rumble.points || 0,
                            qty         : rumble.qty || 0,
                            total_points: rumble?.points * rumble?.qty
                        }
                    }),

                    ...(chance?.points > 0 && {
                        chance            : {
                            points      : chance.points || 0,
                            qty         : chance.qty || 0,
                            total_points: chance?.points * chance?.qty
                        }
                    }),
                    total_qty               : total_qty,
                    total_points            : total_points,
                    payment_mode            : "Points",
                    prize                   : prize,
                    creation_ip             : ipAddress,
                    created_by              : usrId,
                    status                  : "Success",
                    draw_date_time          : campaignData?.draw_date_time,
                    draw_Data               : campaignData?.draw_id?._id,
                    is_print                : 'N'

                }
                const orderData = await campaignOrderServices.createDate(params);
                if(orderData){
                    //create ticket
                    const ticketsParam = await Promise.all(tickets.map((item)=>{
                        return {
                            order_id                : orderData._id,
                            order_no                : order_no,
                            campaign_title          : campaignData?.title,
                            campaign_data           : campaign_id,
                            seller_user_id          : usrId,
                            seller_first_name       : userData?.users_name,
                            seller_last_name        : userData?.last_name,
                            seller_mobile           : userData?.users_mobile,
                            seller_pos_number       : userData?.pos_number,
                            type                    : item.type,
                            ticket                  : item.ticket,
                            points                  : item.points,
                            creation_ip             : ipAddress,
                            created_by              : usrId,
                            status                  : "Success" 
                        }
                    }));
                    const ticketData = await ticketServices.createDate(ticketsParam);
                    //End

                    //Add ticket Ids into order table
                    const ticketIds = ticketData.map(ticket => ticket._id);
                    const updateOption = {
                        condition : { _id : orderData?._id },
                        data : { ticket : ticketIds }
                    }
                    await campaignOrderServices.updateData(updateOption);
                    //End

                    //Debit purchase's points and Credit user's commission
                    const debitOption = {
                        userId                      : usrId,
                        availableArabianPoints      : userData?.availableArabianPoints,
                        debit_amount                : total_points,
                        commission                  : userData?.commission_percentage,
                        order_no                    : order_no,
                        order_objId                 : orderData?._id
                    }
                    debitPoints(debitOption);
                    //End

                    //Get full order details
                    const options2 = {
                        type : "single",
                        condition : { _id : orderData?._id }
                    }
                    const result  = await campaignOrderServices.select_details(options2);
                    return response.sendResponse(res, response.build("SUCCESS", { result }));
                } else{
                    return response.sendResponse(res, response.build('PROCESS_ERROR', { }));
                }
            } else {
                return response.sendResponse(res, response.build('CAMPAIGN_NOT_FOUND', { }));
            }
        }
    } catch (error) {
        console.log('error',error);
        return response.sendResponse( res, response.build("ERROR_SERVER_ERROR", { error }));
    }
}

const debitPoints = async (options) => {
    try {
        const { userId,availableArabianPoints,debit_amount, commission, order_no, order_objId }=options;
        const points = parseFloat(availableArabianPoints) - parseFloat(debit_amount);
        const debitOption = {
            condition : { _id : userId },
            data : {
                availableArabianPoints : points
            }
        }
        const updatedUsers = await userServices.updateData(debitOption);
        const seqData = await counterServices.getSequence('kw_loadBalance');
        const ipAddress = await utility.getIpAddress();
        const debitParam = {
            load_balance_id         : seqData?.seq,
            campaignOrderData       : order_objId,
            campaignOrderNo         : order_no,
    
            credit_user             : null,
            debit_user              : userId,
            points                  : debit_amount,
            availableArabianPoints  : availableArabianPoints,
            end_balance             : points,
            record_type             : "Debit",
            narration               : 'Campaign Purchase',
            
            creation_ip             : ipAddress,
            created_at              : new Date(),
            created_by              : userId,
            created_user_id         : updatedUsers?.users_id,
            status                  : "A"
        }
        await loadbalanceServices.createData(debitParam);

        //Credit Commission
        if(commission > 0){
            const commissionPoints = debit_amount * commission/100;
            const currentAVlPoints = updatedUsers.availableArabianPoints + commissionPoints;
    
            const creditOption = {
                condition : { _id : userId },
                data : {
                    availableArabianPoints : currentAVlPoints
                }
            }
            await userServices.updateData(creditOption);
            const seqData2 = await counterServices.getSequence('kw_loadBalance');
            const creditParam = {
                load_balance_id         : seqData2?.seq,
                campaignOrderData       : order_objId,
                campaignOrderNo         : order_no,
        
                credit_user             : userId,
                debit_user              : null,
                points                  : commissionPoints,
                availableArabianPoints  : updatedUsers?.availableArabianPoints,
                end_balance             : currentAVlPoints,
                record_type             : "Credit",
                narration               : 'Campaign Commission',
                
                creation_ip             : ipAddress,
                created_at              : new Date(),
                created_by              : userId,
                created_user_id         : updatedUsers?.users_id,
                status                  : "A"
            }
            await loadbalanceServices.createData(creditParam);
        }
        return true;
    } catch (error) {
        console.log('error', error);
        return true;
    }
}

/*********************************************************************************
 * Function Name    :   list
 * Purpose          :   This function is get raffle winner's list
 * Created By       :   Afsar Ali
 * Created Data     :   14-01-2025
 * Updated By       :
 * Update Data      :
 ********************************************************************************/
exports.orderHistory = async function (req, res) {
    try {
        const usrId = req.user.userId;
        if(!isValidObjectId(usrId)){
            return response.sendResponse(res, response.build('PERMISSION_ERROR', { }));
        } else{
            const { condition={}, select ={}, limit, skip, sort={}, type } = req.body;
            let listWhere = {
                ...(type?{type:type}:null),
                condition : { 
                    created_by : usrId,
                    ...condition 
                },
                ...(sort? {sort : sort}:{sort : { _id : -1}}),
                ...(select? {select : select}:null),
                ...(limit?{limit : limit}: 0),
                ...(skip?{skip : skip}: 0)
            }
            const result = await campaignOrderServices.select_details(listWhere);
            if (result && type !== "single") {
                const countOption = {
                    type: "count",
                    condition : { 
                        created_by : usrId,
                        ...condition 
                    },
                };
                const count = await campaignOrderServices.select_details(countOption);
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
 * Function Name    :   orderSummery
 * Purpose          :   This function is get campaign order summery data
 * Created By       :   Afsar Ali
 * Created Data     :   23-01-2025
 * Updated By       :
 * Update Data      :
 ********************************************************************************/
exports.orderSummery = async function (req, res) {
    try {
        const usrId = req.user.userId;
        const { from_date, from_time, to_date, to_time, campaign } =req.body;
        const TODAY = new Date();
        let fromDateTime = "";
        let toDateTime = "";
        
        if(!from_date && !from_time){
            fromDateTime = `${TODAY.getFullYear()}-${TODAY.getMonth()+1}-${TODAY.getDate()} 21:30:00`;
        } else if(!from_date && from_time){
            fromDateTime = `${TODAY.getFullYear()}-${TODAY.getMonth()+1}-${TODAY.getDate()} ${from_time}`;
        } else {
            fromDateTime = `${from_date} ${from_time}`;
        }

        if(!to_date && !to_time){
            toDateTime = `${TODAY.getFullYear()}-${TODAY.getMonth()+1}-${TODAY.getDate()} 21:31:00`;
        } else if(!to_date && to_time){
            toDateTime = `${TODAY.getFullYear()}-${TODAY.getMonth()+1}-${TODAY.getDate()} ${to_time}`;
        } else {
            toDateTime = `${to_date} ${to_time}`;
        }
         
        if(!isValidObjectId(usrId)){
            return response.sendResponse(res, response.build('PERMISSION_ERROR', { }));
        } else{
            const option ={
                condition : {
                    ...(campaign && {campaignId : campaign} ),
                    campaignOrderData : {$exists : true},
                    createdAt : {$gte : fromDateTime, $lte : toDateTime},
                    status : "A",
                    created_by : usrId
                },
                select : { campaignOrderData : true, campaignOrderNo : true, points : true, record_type : true, narration : true, created_by : true, createdAt : true }
            }
            const txnData = await loadbalanceServices.select_summery(option);
            console.log(txnData);
            const data = txnData.reduce(
                (acc, item) => {
                    const points = parseFloat(item.points) || 0;
                    const campaignTitle = item.campaignOrderData?.campaign_title;
            
                    if (item.narration === "Campaign Purchase") {
                        acc.sales += item.points || 0;
                        if (campaignTitle) { 
                            acc.campaign[campaignTitle] = acc.campaign[campaignTitle] || { sales: 0, commission : 0, cancelled: 0, paid: 0 };
                            acc.campaign[campaignTitle].sales += points;
                        }
                    } else if (item.narration === "Campaign Commission") {
                        acc.commission += item.points || 0;
                        if (campaignTitle) { 
                            acc.campaign[campaignTitle] = acc.campaign[campaignTitle] || { sales: 0, commission : 0, cancelled: 0, paid: 0 };
                            acc.campaign[campaignTitle].commission += points;
                        }
                    } else if(item.narration === 'Campaign Purchase Cancel'){
                        acc.cancelled += parseFloat(item.points) || 0;
                        if (campaignTitle) { 
                            acc.campaign[campaignTitle] = acc.campaign[campaignTitle] || { sales: 0, commission : 0, cancelled: 0, paid: 0};
                            acc.campaign[campaignTitle].cancelled += points;
                        }
                    } else if(item.narration === 'Lotto Winner Redeem'){
                        acc.paid += parseFloat(item.points) || 0;
                        if (campaignTitle) { 
                            acc.campaign[campaignTitle] = acc.campaign[campaignTitle] || { sales: 0, commission : 0, cancelled: 0, paid: 0};
                            acc.campaign[campaignTitle].paid += points;
                        }
                    }
                    return acc;
                },
                { sales: 0, commission: 0, cancelled:0, paid : 0, campaign:{} }
              );

            const result = {
                total_sales : data?.sales?.toFixed(2) || 0,
                total_commission : data?.commission?.toFixed(2) || 0,
                total_cancelled : data?.cancelled?.toFixed(2) || 0,
                total_paid : data?.paid?.toFixed(2) || 0,
                total_due  : data?.sales?.toFixed(2) - data?.commission?.toFixed(2) - data?.paid?.toFixed(2) || 0,
                campaign: Object.entries(data.campaign).map(([title, values]) => ({
                    title,
                    ...values,
                })),
            }
            return response.sendResponse(res, response.build("SUCCESS", { result : result }));
        }
    } catch (error) {
        console.log('error',error);
        return response.sendResponse( res, response.build("ERROR_SERVER_ERROR", { error }));
    }
}

/*********************************************************************************
* Function Name    :   orderDetails
* Purpose          :   This function is used orderDetails
* Created By       :   Dilip Halder
* Created Data     :   17-01-2025
********************************************************************************/
exports.orderDetails = async function (req, res) {
   try {
       const usrId = req.user.userId;
       if(!isValidObjectId(usrId)){
           return response.sendResponse(res, response.build('PERMISSION_ERROR', { }));
       } else{
           const { condition={}, select ={}, limit, skip, sort={}, type } = req.body;
           let listWhere = {
               ...(type?{type:type}:null),
               condition : { 
                   ...condition 
               },
               ...(sort? {sort : sort}:{sort : { _id : -1}}),
               ...(select? {select : select}:null),
               ...(limit?{limit : limit}: 0),
               ...(skip?{skip : skip}: 0)
           }
           const result = await campaignOrderServices.select_details(listWhere);
           if (result && type !== "single") {
               const countOption = {
                   type: "count",
                   condition : { 
                       ...condition 
                   },
               };
               const count = await campaignOrderServices.select_details(countOption);
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
* Function Name    :   autoPrint
* Purpose          :   This function is used to auto print confirma tion
* Created By       :   Dilip Halder
* Created Data     :   01-05-2025
********************************************************************************/
exports.autoPrint = async function (req, res) {
    try {
        const usrId = req.user.userId;
        const userData = req.user.userData;
        const { id } = req.body;
        if(!isValidObjectId(usrId)){
            return response.sendResponse(res, response.build('PERMISSION_ERROR', { }));
        } else if(!id){
            return response.sendResponse(res, response.build('ORDER_ID_EMPTY', { }));
        }else{

            // Getting current campaign details..
            let listWhere = {
                type : 'single',
                condition : {  _id : id, // status   : 'Success', is_print : 'N'
                },
                select: {
                    status    : 1, 
                    is_print  : 1, 
                }
            }
            const campaignData = await campaignOrderServices.select(listWhere);
            console.log(campaignData)
            if( campaignData != '' && campaignData.is_print == 'N' ){
                //Add ticket print status
                const updateOption = {
                    condition : { _id : id },
                    data      : { is_print : 'Y'}
                }
                const result = await campaignOrderServices.updateData(updateOption);
                return response.sendResponse(res, response.build("SUCCESS", { result }));
            }else if(campaignData != '' && campaignData.is_print == 'Y'){
                return response.sendResponse(res, response.build("ALREADY_PRINTED", { result:[] }));
            }else{
                return response.sendResponse(res, response.build("ORDER_NOT_FOUND", { result:[] }));

            }
        }
    } catch (error) {
        console.log('error',error);
        return response.sendResponse( res, response.build("ERROR_SERVER_ERROR", { error }));
    }
}

