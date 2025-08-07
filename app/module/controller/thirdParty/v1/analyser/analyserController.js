const response = require("../../../../../util/response");
const campaignServices = require("../../../../services/front//v1/campaignServices");
const orderService = require("../../../../services/front/v1/campaignOrderServices");
const lottoWinnerService = require("../../../../services/front/v1/lottoWinnerServices");
const counterServices = require("../../../../services/counterService");
const {isValidObjectId} = require("../../../../../util/valueChecker");
const {getIpAddress} = require("../../../../../util/utility");
const moment = require("moment");
const XLSX = require('xlsx');
const fs = require('fs');
const userServices = require("../../../../services/front/v1/userServices");
const campaignOrderServices = require("../../../../services/front/v1/campaignOrderServices");
const ticketServices = require("../../../../services/front/v1/campaignTicketServices");
const generalData = require("../../../../services/front/v1/commonServices");
const { type } = require("os");
/*********************************************************************************
 * Function Name    :   campaignList
 * Purpose          :   This function is used for list of campaign
 * Created By       :   Afsar Ali
 * Created Data     :   05-01-2025
 * Updated By       :   
 * Update Data      :
 * Remarks          :
 ********************************************************************************/
exports.campaignList = async function (req, res) {
    try {
        const { condition={}, select ={}, sort={}, type  }=req.body;
        let listWhere = {
            ...(type?{type:type}:null),
            condition : {
                ...condition,
                status : "A",
                prizeData : {$exists : true}
            },
            ...(sort? {sort : sort}:null),
            ...(select? {select : select}:null),
            limit : 0,
            skip : 0,
        }
        const result = await campaignServices.select_details(listWhere);
        return response.sendResponse(res, response.build("SUCCESS", { result }));
    } catch (error) {
        console.log('error :', error);
        return response.sendResponse(res, response.build('ERROR_SERVER_ERROR', { error }));
    }
}; //End of Function

/*********************************************************************************
 * Function Name    :   orderReports
 * Purpose          :   This function is used for campaign orders statistics reports
 * Created By       :   Afsar Ali
 * Created Data     :   01-05-2025
 * Updated By       :
 * Update Data      :
 ********************************************************************************/
exports.orderReports = async function (req, res) {
    try {
        let { campaignId, date } = req.body;
        const campaignData = await campaignServices.getCampaignById(campaignId);
        const startDay = moment(date).startOf('day');
        const endDay = moment(date).endOf('day');
        const option = {
            type : "multiple",
            // condition : { campaign_data : campaignId, draw_date : moment(date).format('YYYY-MM-DD') },
            condition : { campaign_data : campaignId, draw_date : {$gte : startDay, $lte : endDay } },
            sort : {_id : -1},
            select : { _id : true}
        }
        const drawData = await campaignServices.select_draw(option);            
        if(campaignData && drawData?.length > 0){
            const drawIds = drawData.map((item) => item._id);
            const pipeline = [
                {
                    $match: { 
                        campaign_data: campaignData?._id,
                        draw_Data : {$in : drawIds},
                        status: { $in: ['Success', 'Cancel'] }
                    }
                },
                {
                    $project: {
                        status: 1,
                        ticketCount: { $size: "$ticket" }
                    }
                },
                {
                    $group: {
                        _id: "$status",
                        total_qty: { $sum: "$ticketCount" }
                    }
                },
                { $sort: { "_id": 1 } }
            ];
            const result = await orderService.orderAggregate(pipeline);
            return response.sendResponse(res, response.build("SUCCESS", { result }));
        } else{
            return response.sendResponse(res, response.build("ERROR_DATA_NOT_FOUND", { }));   
        }
    } catch (error) {
        console.log('error',error);
        return response.sendResponse( res, response.build("ERROR_SERVER_ERROR", { error }));
    }
}

/*********************************************************************************
 * Function Name    :   createWinner
 * Purpose          :   This function is add/edit lotto winner data
 * Created By       :   Afsar Ali
 * Created Data     :   07-05-2025
 * Updated By       :
 * Update Data      :
 ********************************************************************************/
exports.createWinner = async function (req, res) {
    try {
        const usrId = req.user.userId;       
        const {param, game_name} = req.body;
        if(!isValidObjectId(usrId)){
            return response.sendResponse(res, response.build('PERMISSION_ERROR', { }));
        } else if(!param || param.length === 0){
            return response.sendResponse(res, response.build('WINNER_LIST_EMPTY', { }));
        } else{
            const startOfDay = moment().startOf('day').toDate();
            const endOfDay = moment().endOf('day').toDate();
            const file = `${game_name?game_name:'Automate'} ${moment().format('YYYY-MM-DD')}`;
            const checkOption = {
                type : 'count',
                condition : { 
                    file : file,
                    status : "Active",
                    createdAt : {$gte: startOfDay, $lt: endOfDay}
                }
            }
            const winnersCount = await lottoWinnerService.select(checkOption);
            if(winnersCount === 0){
                const ipAddress = await getIpAddress();
                const seqData = await counterServices.getSequence('kw_lotto_winners');
                const processItems = param.map((items) => {
                    try {
                        return {
                            batch_id          : seqData?.seq,
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
    
                            file              : file,
    
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
            } else{
                return response.sendResponse(res, response.build("WINNERS_ALREADY_EXIST", {  }));
            }
        }
    } catch (error) {
        console.log('error',error);
        return response.sendResponse( res, response.build("ERROR_SERVER_ERROR", { error }));
    }
}// End of function

/*********************************************************************************
 * Function Name    :   autoCreateOrder
 * Purpose          :   This function is auto create campaign order
 * Created By       :   Afsar Ali
 * Created Data     :   04-04-2025
 * Updated By       :
 * Update Data      :
 ********************************************************************************/
exports.autoCreateOrder = async function (req, res) {
    try {
        const userIdList = ['6709039ebf08384ad3032e74','670ccf3b5d52a72da30e38c4','6731e1d732f3a47630040fb4','67454f82f47323b10207bf82','674af8b6da3ce130da03cae4', '675ac3c3ff6ac3acab7dd170', '679111f2899ed291cae590b7']
        // const usrId = req.user.userId;
        // const userData = req.user.data;

        const ipAddress = await getIpAddress();
        const filePath = './newOrderData.xlsx';
        const fileBuffer = fs.readFileSync(filePath); // Read file as buffer
        const workbook = XLSX.read(fileBuffer, { type: 'buffer' });

        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const param = XLSX.utils.sheet_to_json(worksheet);
        // return response.sendResponse( res, response.build("SUCCESS", { result : param }));
        const pageSize = 500; // Process 500 records per batch
        const totalPages = Math.ceil(param?.length / pageSize);
        //Params have more than 82k data need to process this data in 500 pagination
        const processBatch = async (batch, pageIndex) => {
            // console.log(`Processing batch ${pageIndex + 1}/${totalPages}...`);
            const promises = batch.map(async (item) => {
                try {
                    const usrId = userIdList[Math.floor(Math.random() * 7)];
                    const optionUser = {
                        type: 'single',
                        condition: { _id: usrId }
                    };
                    const userData = await userServices.select(optionUser);
                    // console.log('usrId : ', usrId);
        
                    const options = {
                        type: 'single',
                        condition: {
                            title: item['Product Name'],
                            status: "A",
                            prizeData: { $exists: true }
                        }
                    };
                    const campaignData = await campaignServices.select_details(options);
                    const draw_date = moment.utc(`${campaignData?.draw_date}`).format('YYYY-MM-DD');
                    const draw_time = `${campaignData?.draw_time}`;
                    const pin = Math.floor(1000 + Math.random() * 9000);
        
                    const params = {
                        order_no: item['Order ID'],
                        campaign_title: item['Product Name'],
                        campaign_data: campaignData?._id,
                        draw_date_time: `${draw_date} ${draw_time}`,
                        draw_Data: campaignData?.draw_id?._id,
                        seller_user_id: usrId,
                        seller_first_name: userData?.users_name,
                        seller_last_name: userData?.last_name,
                        seller_mobile: userData?.users_mobile,
                        seller_pos_number: userData?.pos_number,
                        area: userData?.area || 'N/A',
                        bind_person_name: userData?.bind_person_name,
                        bind_person_mobile: userData?.bind_person_mobile,
                        commission_percentage: userData?.commission_percentage,
        
                        ...(item['Straight Amount'] > 0 && {
                            straight: {
                                points: 5,
                                qty: item['Straight Amount'],
                                total_points: 5 * item['Straight Amount']
                            }
                        }),
                        ...(item['Rumble Amount'] > 0 && {
                            rumble: {
                                points: 5,
                                qty: item['Rumble Amount'],
                                total_points: 5 * item['Rumble Amount']
                            }
                        }),
                        ...(item['Chance Amount'] > 0 && {
                            chance: {
                                points: 5,
                                qty: item['Chance Amount'],
                                total_points: 5 * item['Chance Amount']
                            }
                        }),
        
                        total_qty: item['Chance Amount'] + item['Rumble Amount'] + item['Straight Amount'],
                        total_points: (item['Chance Amount'] + item['Rumble Amount'] + item['Straight Amount']) * 5,
        
                        payment_mode: "Points",
                        verification_code : parseInt(pin),
                        opening_ballance: 0,
                        end_ballance: 0,
        
                        creation_ip: ipAddress,
                        created_by: usrId,
                        status: "Success",
                        version: '1.0.0'
                    };
        
                    const checkOption = {
                        type: 'single',
                        condition: { order_no: item['Order ID'] }
                    };
                    // const orderCheck = await campaignOrderServices.select(checkOption);
                    // let orderData = orderCheck || await campaignOrderServices.createDate(params);
                    let orderData = await campaignOrderServices.select(checkOption);
                    if (!orderData) {
                        try {
                            orderData = await campaignOrderServices.createDate(params);
                        } catch (err) {
                            if (err.code === 11000) {
                                // Duplicate key error, safely fetch the existing one
                                orderData = await campaignOrderServices.select(checkOption);
                            } else {
                                throw err;
                            }
                        }
                    }
        
                    // console.log('orderData?._id : ', orderData?._id);
        
                    if (orderData && orderData?._id) {
                        const commParam = {
                            order_id: orderData._id,
                            order_no: orderData?.order_no,
                            campaign_title: campaignData?.title,
                            campaign_data: campaignData?._id,
                            seller_user_id: usrId,
                            seller_first_name: userData?.users_name,
                            seller_last_name: userData?.last_name,
                            seller_mobile: userData?.users_mobile,
                            seller_pos_number: userData?.pos_number,
                            creation_ip: ipAddress,
                            created_by: usrId,
                            status: "Success",
                            version: '1.0.0'
                        };
        
                        const ticketTypes = ['Straight', 'Rumble', 'Chance'];
                        for (const type of ticketTypes) {
                            const amount = item[`${type} Amount`];
                            if (amount > 0) {
                                const ticketParam = {
                                    ...commParam,
                                    type,
                                    ticket: item['Coupons'],
                                    points: 5
                                };
                                await ticketServices.createDate(ticketParam);
                            }
                        }
        
                        const tktOption = {
                            condition: { order_no: item['Order ID'] }
                        };
                        const ticketData = await ticketServices.select(tktOption);
                        const ticketIds = ticketData.map(ticket => ticket._id);
        
                        const updateOption = {
                            condition: { _id: orderData?._id },
                            data: { ticket: ticketIds }
                        };
                        await campaignOrderServices.updateData(updateOption);
                    }
        
                    return { id: item['Order ID'] };
                } catch (error) {
                    console.error('Error processing item:', error);
                    return null;
                }
            });
        
            const results = await Promise.all(promises);
            return results.filter(item => item !== null);
        };
        
        // Paginate and process in chunks
        for (let i = 0; i < totalPages; i++) {
            const start = i * pageSize;
            const end = start + pageSize;
            const batch = param.slice(start, end);
            const processedBatch = await processBatch(batch, i);
            console.log(`Processed ${processedBatch.length} records in batch ${i + 1}`);
        }
        

        return response.sendResponse( res, response.build("SUCCESS", { message : "done" }));
    } catch (error) {
        console.log('error',error);
        return response.sendResponse( res, response.build("ERROR_SERVER_ERROR", { error }));
    }
}

/*********************************************************************************
 * Function Name    :   getGeneralData
 * Purpose          :   This function is used for campaign orders statistics reports
 * Created By       :   Afsar Ali
 * Created Data     :   19-05-2025
 * Updated By       :
 * Update Data      :
 ********************************************************************************/
exports.getGeneralData = async function (req, res) {
    try {
        const option = {
            type : "single",
            condition : {},
            select : {analyser_end_time : true, analyser_start_time : true},
            sort : { _id : -1}
        }
        const result = await generalData.select(option);
        return response.sendResponse(res, response.build("SUCCESS", { result }));
    } catch (error) {
        console.log('error',error);
        return response.sendResponse( res, response.build("ERROR_SERVER_ERROR", { error }));
    }
}