const response = require("../../../../../../util/response");
const OrderServices = require("../../../../../services/front/v1/lottoOrderServices");
const productServices = require("../../../../../services/front/v1/productServices");
const userServices = require("../../../../../services/front/v1/userServices");
const counter = require("../../../../../services/counterService");
const loadbalanceServices = require("../../../../../services/front/v1/loadbalanceServices");
const commonServices = require("../../../../../services/front/v1/commonServices");
const moment = require('moment');
const { base64_encode } = require('../../../../../../util/crypto');
const { loginIP,stringToObjectId } = require("../../../../../../util/utility");
const {isValidObjectId} = require('../../../../../../util/valueChecker');
const { array } = require("joi");
  /*********************************************************************************
 * Function Name    :   create
 * Purposs          :   This function is used for create orders
 * Created By       :   Afsar Ali
 * Created Data     :   06-NOV-2024
 * Updated By       :   
 * Update Data      :
 * Remarks          :
 ********************************************************************************/
 exports.create = async function (req, res) {
    try {
        const userId = req.user.userId;
        const email = req.user.email;
        const userType = req.user.userType;
        const phone = req.user.phone;
        
        const { store_name,pos_number,pos_device_id,availableArabianPoints,commission_percentage } = req.user.userData;
        
        const { 
            product_id, qty, subtotal, total_price, vat_amount, ticket, selection_values,
            straight_add_on_amount,rumble_add_on_amount,reverse_add_on_amount,
            device_type, app_version }=req.body;
        const productOption ={
            type : 'single',
            condition : { _id : product_id }
        }
        const productData = await productServices.selectWithPopulate(productOption);
        if(productData.status === 'A'){
            const today_date = new Date();
            let draw_date = new Date(`${productData.draw_date}`);
            let time = productData.draw_time.split(':');
            draw_date.setHours(time[0]);
            draw_date.setMinutes(time[1]);
            draw_date.setSeconds('00');
            if(today_date > draw_date){
                return response.sendResponse(res, response.build('DRAW_DATE_ERROR', { error }));
            } else{
                const sequence_id = await counter.getSequence('kw_lotto_orders');
                const orderId = await counter.getOrerId('orders');
                const code  = Math.floor(1000 + Math.random() * 9000);
                const order_code = await base64_encode(code);
                const ipAddress = await loginIP();
                const orderParams = {
                    sequence_id : sequence_id.seq,
                    order_id : `KWINN${orderId}`,
                    draw : productData.draw_oid,
                    order_code : order_code,
                    user_data : userId,
                    user_type : userType,
                    user_email : email,
                    user_phone : phone,
                    store_name : store_name?store_name:'',
                    pos_number : pos_number?pos_number:'',
                    pos_device_id : pos_device_id?pos_device_id:'',
                    product_data : product_id,
                    product_title : productData.title,
                    product_qty : qty,
                    prize_title : productData.prize_data?.title,
                    vat_amount : vat_amount?vat_amount:0,
                    straight_add_on_amount : straight_add_on_amount?straight_add_on_amount:0,
                    rumble_add_on_amount : rumble_add_on_amount?rumble_add_on_amount:0,
                    reverse_add_on_amount : reverse_add_on_amount?reverse_add_on_amount:0,
                    subtotal : subtotal,
                    total_price : total_price,
                    availableArabianPoints : parseFloat(availableArabianPoints),
                    end_balance : parseFloat(availableArabianPoints) - parseFloat(total_price),
                    payment_mode : "KPoints",
                    order_status : "Success",
                    draw_date_time : draw_date,
                    device_type : device_type,
                    app_version : app_version,
                    ticket : ticket,
                    selection_values : selection_values?selection_values:'',
                    commission_percentage : commission_percentage,
                    is_print : "N",
                    creation_ip : ipAddress?ipAddress:"",
                    created_at : new Date()
                }
                const result = await OrderServices.createData(orderParams);
                if(result){
                    const debitOption = {
                        userId                  : userId,
                        availableArabianPoints  : availableArabianPoints,
                        debit_amount            : total_price,
                        order_id                : result._id,
                        product_id              : product_id,
                        order_seq_id            : result.order_id
                    }
                    await debitPoints(debitOption);
                    const commission_amount = (parseFloat(total_price) * parseFloat(commission_percentage)) / 100;
                    const commissionOption = {
                        userId                  : userId,
                        availableArabianPoints  : parseFloat(availableArabianPoints) - parseFloat(total_price),
                        credit_amount           : commission_amount,
                        order_id                : result._id,
                        product_id              : product_id,
                        order_seq_id            : result.order_id
                    }
                    creditPoints(commissionOption);
                    return response.sendResponse(res, response.build('SUCCESS', { result }));
                }else{
                    return response.sendResponse(res, response.build('ORDER_ERROR', { }));
                }
            }
        } else{
            return response.sendResponse(res, response.build('PRODUCT_NOT_FOUND', { }));
        }
    } catch (error) {
        console.log('error',error)
        return response.sendResponse(res, response.build('ERROR_SERVER_ERROR', { error }));
    }
  }; //End of Function

  const debitPoints = async (options) => {
    try {
        const { userId,availableArabianPoints,debit_amount,order_id,order_seq_id,product_id }=options;
        const points = parseFloat(availableArabianPoints) - parseFloat(debit_amount);
        const option = {
            condition : { _id : userId },
            data : {
                availableArabianPoints : points
            }
        }
        await userServices.updateData(option);
        const sequence = await counter.getSequence('kw_loadBalance');
        const ipAddress = await loginIP();
        const param = {
            load_balance_id : sequence.seq,
            orderdata : order_id,
            product_id : product_id,
            debit_user : userId,
            order_id : order_seq_id,
            points : debit_amount,
            availableArabianPoints : availableArabianPoints,
            end_balance : points,
            record_type : "Debit",
            narration : 'Order',
            remarks : `Ticket ID : ${order_seq_id}`,
            creation_ip : ipAddress,
            created_at : new Date(),
            created_by : userId,
            status : "A"
        }
        await loadbalanceServices.createData(param);
        return true;
    } catch (error) {
        return true;
    }
  }

  const creditPoints = async (options) => {
    try {
        const { userId,availableArabianPoints,credit_amount,order_id,order_seq_id,product_id }=options;
        const points = parseFloat(availableArabianPoints) + parseFloat(credit_amount);
        const option = {
            condition : { _id : userId },
            data : {
                availableArabianPoints : points
            }
        }
        await userServices.updateData(option);
        const sequence = await counter.getSequence('kw_loadBalance');
        const ipAddress = await loginIP();
        const param = {
            load_balance_id : sequence.seq,
            orderdata : order_id,
            product_id : product_id,
            credit_user : userId,
            order_id : order_seq_id,
            points : credit_amount,
            availableArabianPoints : availableArabianPoints,
            end_balance : points,
            record_type : "Credit",
            narration : 'Commission',
            remarks : `Ticket ID : ${order_seq_id}`,
            creation_ip : ipAddress,
            created_at : new Date(),
            created_by : userId,
            status : "A"
        }
        loadbalanceServices.createData(param);
        return true;
    } catch (error) {
        return true;
    }
  }

  /*********************************************************************************
 * Function Name    :   List
 * Purposs          :   This function is used for get lotto orders list
 * Created By       :   Afsar Ali
 * Created Data     :   07-NOV-2024
 * Updated By       :   
 * Update Data      :
 * Remarks          :
 ********************************************************************************/
 exports.list = async function (req, res) {
    try {
        const userId = req.user.userId;
        const { condition={}, select ={}, sort={}, type, skip, limit }=req.body;
        if(!isValidObjectId(userId)){
            return response.sendResponse(res, response.build('ERROR_DATA_NOT_FOUND', { }));
        }else{
            let listWhere = {
                condition : {
                    user_data : userId,
                    ...condition
                },
                ...(sort? {sort : sort}:null),
                ...(select? {select : select}:null),
                ...(type?{type:type}:null),
                ...(skip?{skip:skip}:null),
                ...(limit?{limit:limit}:{limit : 10}),
    
            }
            const result = await OrderServices.selectWithPopulate(listWhere);
            return response.sendResponse(res, response.build('SUCCESS', { result }));
        }
    } catch (error) {
        console.log('error',error)
        return response.sendResponse(res, response.build('ERROR_SERVER_ERROR', { error }));
    }
  }; //End of Function

  /*********************************************************************************
 * Function Name    :   drawList
 * Purpose          :   This function is used for get lotto orders draw list
 * Created By       :   Afsar Ali
 * Created Data     :   08-NOV-2024
 * Updated By       :   
 * Update Data      :
 * Remarks          :
 ********************************************************************************/
 exports.drawList = async function (req, res) {
    try {
        // const userId = req.user.userId;
        const { reportPin, draw_start_date, draw_end_date }=req.body;
        if(!isValidObjectId){
            return response.sendResponse(res, response.build('ERROR_DATA_NOT_FOUND', { }));
        }else if(!reportPin){
            return response.sendResponse(res, response.build('PIN_EMPTY', { }));
        }else{
            const options = { 
                type : 'single', 
                select : { 
                    drawdata_pin : true, 
                    draw_time_start : true, 
                    draw_time_end : true 
                },
                shot : { '_id' : -1 }
             };
            const generalData = await commonServices.select(options);
            if(generalData && parseInt(generalData.drawdata_pin) === parseInt(reportPin)){
                let draw_start = new Date(draw_start_date);
                let start_time = generalData.draw_time_start.split(':');
                draw_start.setHours(start_time[0]);
                draw_start.setMinutes(start_time[1]);
                draw_start.setSeconds('00');

                let draw_end = new Date(draw_end_date);
                let end_time = generalData.draw_time_end.split(':');
                draw_end.setHours(end_time[0]);
                draw_end.setMinutes(end_time[1]);
                draw_end.setSeconds('00');

                const orderOptions = {
                    condition : {
                        draw_date_time : { $gte : draw_start, $lte : draw_end}
                    }
                }

                const orderData = await OrderServices.selectDrawListWithPopulate(orderOptions);
                // const result = await Promise.all(orderData.map((item) => {
                    
                //     return {
                //         order: item.id,
                //         product: item.product
                //     };
                // }));
                const result = await processOrderData(orderData);
                return response.sendResponse(res, response.build('SUCCESS', { result }));
            }else{
                return response.sendResponse(res, response.build('PIN_ERROR', { }));
            }
        }
    } catch (error) {
        console.log('error',error)
        return response.sendResponse(res, response.build('ERROR_SERVER_ERROR', { error }));
    }
  }; //End of Function

  const processOrderData = (OrderData) => {
    return new Promise((resolve, reject) => {
      try {
        const CSVData = OrderData.flatMap((itemsArray) => {
          let createdAt, OrderStatus;
  
          if (itemsArray.status === "CL") {
            createdAt = moment(itemsArray.updatedAt).format('DD-MMM-YYYY HH:mm:ss');
            OrderStatus = "Cancelled";
          } else if (itemsArray.order_status) {
            createdAt = moment(itemsArray.createdAt).format('DD-MMM-YYYY HH:mm:ss');
            OrderStatus = itemsArray.order_status;
          }
  
          const selectionValues = itemsArray.selection_values ? JSON.parse(itemsArray.selection_values) : [];
          const tickets = itemsArray.ticket.replace(/\[\[|\]\]/g, "/").replace(/\],\[/g, "/").split("/").filter(Boolean);
  
          return tickets.map((coupon, subindex) => {
            const straight = selectionValues[subindex]?.[0] ? 1 : (itemsArray.straight_add_on_amount ? 1 : 0);
            const rumble = selectionValues[subindex]?.[1] ? 1 : (itemsArray.rumble_add_on_amount ? 1 : 0);
            const reverse = selectionValues[subindex]?.[2] ? 1 : (itemsArray.reverse_add_on_amount ? 1 : 0);
  
            let sellerPOS = "N/A", sellerName = "N/A", sellerMobile = "N/A", sellerStore = "N/A", sellerBindWithName = "N/A";
  
            if (itemsArray.user_data) {
              const sellerDetails = itemsArray.user_data;
              const countryPrefix = sellerDetails.country_code;
              sellerPOS = sellerDetails.pos_number ? `${countryPrefix}_${sellerDetails.pos_number}` : (itemsArray.pos_number || "N/A");
              sellerName = sellerDetails.users_name || itemsArray.users_name || "N/A";
              sellerMobile = sellerDetails.user_phone || itemsArray.user_phone || "N/A";
              sellerStore = sellerDetails.store_name || itemsArray.store_name || "N/A";
              sellerBindWithName = sellerDetails.bind_person_name || itemsArray.bind_person_name || "N/A";
            }
  
            return {
              "POS No.": sellerPOS,
              "Order ID": itemsArray.order_id || "N/A",
              "Product Name": itemsArray.product_name || "N/A",
              "Store Name": sellerStore,
              "Seller Name": sellerName,
              "Seller Mobile": sellerMobile,
              "Bind With": sellerBindWithName,
              "Straight Amount": straight || "0",
              "Rumble Amount": rumble || "0",
              "Chance Amount": reverse || "0",
              "Payment Status": OrderStatus || "N/A",
              "Purchase Date": createdAt || "N/A",
              "Coupons": coupon || "N/A"
            };
          });
        });
  
        resolve(CSVData);
      } catch (error) {
        reject(error);
      }
    });
  };  

/*********************************************************************************
 * Function Name    :   orderSummeryReports
 * Purpose          :   This function is used for get lotto order summery reports draw list
 * Created By       :   Afsar Ali
 * Created Data     :   09-NOV-2024
 * Updated By       :   
 * Update Data      :
 * Remarks          :
 ********************************************************************************/
 exports.orderSummeryReports = async function (req, res) {
    try {
        const userId = req.user.userId;
        const userData = req.user.userData;
        const { start_date, end_date }=req.body;
        if(!isValidObjectId(userId)){
            return response.sendResponse(res, response.build('ERROR_DATA_NOT_FOUND', { }));
        }else if(!start_date){
            return response.sendResponse(res, response.build('START_DATE_EMPTY', { }));
        }else if(!end_date){
            return response.sendResponse(res, response.build('END_DATE_EMPTY', { }));
        }else{
            //Get sum of total order amount
            const creaditTotalPipeline = [
                {
                    $match: {
                        debit_user : stringToObjectId(userId),
                        record_type : 'Credit',
                        narration : {$in : ['Order','Order Cancalled']},
                        createdAt: {
                            $gte: new Date(start_date),
                            $lte: new Date(end_date)
                        }
                    }
                },
                {
                    $group: {
                        _id: null,
                        amount: { $sum: "$points" }
                    }
                }   
            ];
            const creditTotal = await loadbalanceServices.aggregate(creaditTotalPipeline);
            const creditTotalAmount = creditTotal.length > 0 ?creditTotal[0].amount:0;
            const debitTotalPipeline = [
                {
                    $match: {
                        debit_user : stringToObjectId(userId),
                        record_type : 'Debit',
                        narration : {$in : ['Order','Order Cancalled']},
                        createdAt: {
                            $gte: new Date(start_date),
                            $lte: new Date(end_date)
                        }
                    }
                },
                {
                    $group: {
                        _id: null,
                        amount: { $sum: "$points" }
                    }
                }   
            ];
            const debitTotal = await loadbalanceServices.aggregate(debitTotalPipeline);
            const debitTotalAmount = debitTotal.length > 0 ?debitTotal[0].amount:0;
            totalAmount = parseFloat(debitTotalAmount) - parseFloat(creditTotalAmount);
            //Get sum of total commission order amount
            const creditCommissionPipeline = [
                {
                    $match: {
                        credit_user : stringToObjectId(userId),
                        record_type : "Credit",
                        narration : {$in : ['Commission','Commission Reverted']},
                        createdAt: {
                            $gte: new Date(start_date),
                            $lte: new Date(end_date)
                        }
                    }
                },
                {
                    $group: {
                        _id: null,
                        amount: { $sum: "$points" }
                    }
                }   
            ];
            const creditCommission = await loadbalanceServices.aggregate(creditCommissionPipeline);
            const creditCommissionAmount = creditCommission.length > 0 ?creditCommission[0].amount:0;
            
            const debitCommissionPipeline = [
                {
                    $match: {
                        credit_user : stringToObjectId(userId),
                        record_type : "Debit",
                        narration : {$in : ['Commission','Commission Reverted']},
                        createdAt: {
                            $gte: new Date(start_date),
                            $lte: new Date(end_date)
                        }
                    }
                },
                {
                    $group: {
                        _id: null,
                        amount: { $sum: "$points" }
                    }
                }   
            ];
            const debitCommission = await loadbalanceServices.aggregate(debitCommissionPipeline);
            const debitCommissionAmount = debitCommission.length > 0 ?debitCommission[0].amount:0;
            const commissionAmount = parseFloat(creditCommissionAmount) - parseFloat(debitCommissionAmount);

            //Get sum of total cancel order amount
            const totalCancelPipeline = [
                {
                    $match: {
                        credit_user : stringToObjectId(userId),
                        narration : "Order Cancalled",
                        createdAt: {
                            $gte: new Date(start_date),
                            $lte: new Date(end_date)
                        }
                    }
                },
                {
                    $group: {
                        _id: null,
                        amount: { $sum: "$points" }
                    }
                }   
            ];
            const totalCancelOrder = await loadbalanceServices.aggregate(totalCancelPipeline);
            const totalCancelAmount = totalCancelOrder.length > 0 ?totalCancelOrder[0].amount:0;

            //Get sum of total Paid customer
            const totalPaidPipeline = [
                {
                    $match: {
                        credit_user : stringToObjectId(userId),
                        narration : "Redeem Prize",
                        createdAt: {
                            $gte: new Date(start_date),
                            $lte: new Date(end_date)
                        }
                    }
                },
                {
                    $group: {
                        _id: null,
                        amount: { $sum: "$points" }
                    }
                }   
            ];
            const totalPaid = await loadbalanceServices.aggregate(totalPaidPipeline);
            const totalCustomerPaid = totalPaid.length > 0 ?totalPaid[0].amount:0;
            
            const dueBalance = totalAmount - commissionAmount - totalCancelAmount;

            const result = {
                totalAmount : totalAmount?totalAmount:0,
                commissionAmount : commissionAmount?commissionAmount:0,
                totalCancelOrderAmount : totalCancelAmount?totalCancelAmount:0,
                totalCustomerPaid : totalCustomerPaid?totalCustomerPaid:0,
                dueBalance : dueBalance?dueBalance:0               
            }
            return response.sendResponse(res, response.build('SUCCESS', { result }));
            
        }
    } catch (error) {
        console.log('error',error)
        return response.sendResponse(res, response.build('ERROR_SERVER_ERROR', { error }));
    }
  }; //End of Function

  /*********************************************************************************
 * Function Name    :   productSummeryReports
 * Purpose          :   This function is used for get lotto order summery reports draw list
 * Created By       :   Afsar Ali
 * Created Data     :   09-NOV-2024
 * Updated By       :   
 * Update Data      :
 * Remarks          :
 ********************************************************************************/
 exports.productSummeryReports = async function (req, res) {
    try {
        const userId = req.user.userId;
        const userData = req.user.userData;
        const { product_id, start_date, end_date }=req.body;
        if(!isValidObjectId(userId)){
            return response.sendResponse(res, response.build('ERROR_DATA_NOT_FOUND', { }));
        }else if(!isValidObjectId(product_id)){
            return response.sendResponse(res, response.build('ERROR_DATA_NOT_FOUND', { }));
        }else if(!start_date){
            return response.sendResponse(res, response.build('START_DATE_EMPTY', { }));
        }else if(!end_date){
            return response.sendResponse(res, response.build('END_DATE_EMPTY', { }));
        }else{
            const options = {
                type : 'single',
                condition : { status : 'A' }
            }
            const productData = await productServices.select(options);
            if(productData){
                //Get sum of total order amount
                const creaditTotalPipeline = [
                    {
                        $match: {
                            debit_user : stringToObjectId(userId),
                            product_id : stringToObjectId(product_id),
                            record_type : 'Credit',
                            narration : {$in : ['Order','Order Cancalled']},
                            createdAt: {
                                $gte: new Date(start_date),
                                $lte: new Date(end_date)
                            }
                        }
                    },
                    {
                        $group: {
                            _id: null,
                            amount: { $sum: "$points" }
                        }
                    }   
                ];
                const creditTotal = await loadbalanceServices.aggregate(creaditTotalPipeline);
                const creditTotalAmount = creditTotal.length > 0 ?creditTotal[0].amount:0;
                const debitTotalPipeline = [
                    {
                        $match: {
                            debit_user : stringToObjectId(userId),
                            product_id : stringToObjectId(product_id),
                            record_type : 'Debit',
                            narration : {$in : ['Order','Order Cancalled']},
                            createdAt: {
                                $gte: new Date(start_date),
                                $lte: new Date(end_date)
                            }
                        }
                    },
                    {
                        $group: {
                            _id: null,
                            amount: { $sum: "$points" }
                        }
                    }   
                ];
                const debitTotal = await loadbalanceServices.aggregate(debitTotalPipeline);
                const debitTotalAmount = debitTotal.length > 0 ?debitTotal[0].amount:0;
                totalAmount = parseFloat(debitTotalAmount) - parseFloat(creditTotalAmount);
                //Get sum of total commission order amount
                const creditCommissionPipeline = [
                    {
                        $match: {
                            credit_user : stringToObjectId(userId),
                            product_id : stringToObjectId(product_id),
                            record_type : "Credit",
                            narration : {$in : ['Commission','Commission Reverted']},
                            createdAt: {
                                $gte: new Date(start_date),
                                $lte: new Date(end_date)
                            }
                        }
                    },
                    {
                        $group: {
                            _id: null,
                            amount: { $sum: "$points" }
                        }
                    }   
                ];
                const creditCommission = await loadbalanceServices.aggregate(creditCommissionPipeline);
                const creditCommissionAmount = creditCommission.length > 0 ?creditCommission[0].amount:0;
                
                const debitCommissionPipeline = [
                    {
                        $match: {
                            credit_user : stringToObjectId(userId),
                            product_id : stringToObjectId(product_id),
                            record_type : "Debit",
                            narration : {$in : ['Commission','Commission Reverted']},
                            createdAt: {
                                $gte: new Date(start_date),
                                $lte: new Date(end_date)
                            }
                        }
                    },
                    {
                        $group: {
                            _id: null,
                            amount: { $sum: "$points" }
                        }
                    }   
                ];
                const debitCommission = await loadbalanceServices.aggregate(debitCommissionPipeline);
                const debitCommissionAmount = debitCommission.length > 0 ?debitCommission[0].amount:0;
                const commissionAmount = parseFloat(creditCommissionAmount) - parseFloat(debitCommissionAmount);
    
                //Get sum of total cancel order amount
                const totalCancelPipeline = [
                    {
                        $match: {
                            credit_user : stringToObjectId(userId),
                            product_id : stringToObjectId(product_id),
                            narration : "Order Cancalled",
                            createdAt: {
                                $gte: new Date(start_date),
                                $lte: new Date(end_date)
                            }
                        }
                    },
                    {
                        $group: {
                            _id: null,
                            amount: { $sum: "$points" }
                        }
                    }   
                ];
                const totalCancelOrder = await loadbalanceServices.aggregate(totalCancelPipeline);
                const totalCancelAmount = totalCancelOrder.length > 0 ?totalCancelOrder[0].amount:0;
    
                //Get sum of total Paid customer
                const totalPaidPipeline = [
                    {
                        $match: {
                            credit_user : stringToObjectId(userId),
                            product_id : stringToObjectId(product_id),
                            narration : "Redeem Prize",
                            createdAt: {
                                $gte: new Date(start_date),
                                $lte: new Date(end_date)
                            }
                        }
                    },
                    {
                        $group: {
                            _id: null,
                            amount: { $sum: "$points" }
                        }
                    }   
                ];
                const totalPaid = await loadbalanceServices.aggregate(totalPaidPipeline);
                const totalCustomerPaid = totalPaid.length > 0 ?totalPaid[0].amount:0;
                
                const dueBalance = totalAmount - commissionAmount - totalCancelAmount;
    
                const result = {
                    _id : productData?.title,
                    price : productData?.straight_add_on_amount,
                    sales_count : 0,
                    sales : 0,
                    product_image : productData?.product_image,
                    product_id : productData._id,
                    totalAmount : totalAmount?totalAmount:0,
                    commissionAmount : commissionAmount?commissionAmount:0,
                    totalCancelOrderAmount : totalCancelAmount?totalCancelAmount:0,
                    totalCustomerPaid : totalCustomerPaid?totalCustomerPaid:0,
                    dueBalance : dueBalance?dueBalance:0               
                }
                return response.sendResponse(res, response.build('SUCCESS', { result }));
            } else{
                return response.sendResponse(res, response.build('ERROR_DATA_NOT_FOUND', { }));
            }
        }
    } catch (error) {
        console.log('error',error)
        return response.sendResponse(res, response.build('ERROR_SERVER_ERROR', { error }));
    }
  }; //End of Function
 /*********************************************************************************
 * Function Name    :   markAsPrint
 * Purpose          :   This function is used for get lotto orders list
 * Created By       :   Afsar Ali
 * Created Data     :   11-06-2025
 * Updated By       :   
 * Update Data      :
 * Remarks          :
 ********************************************************************************/
 exports.markAsPrint = async function (req, res) {
    try {
        const userId = req.user.userId;
        const { order_id }=req.body;
        if(!isValidObjectId(userId) || !isValidObjectId(order_id)){
            return response.sendResponse(res, response.build('ERROR_DATA_NOT_FOUND', { }));
        }else{
            let updateOption = {
                condition : { _id : order_id },
                data : { is_print : "Y"}
            }
            const result = await OrderServices.updateData(updateOption);
            return response.sendResponse(res, response.build('SUCCESS', { result }));
        }
    } catch (error) {
        console.log('error',error)
        return response.sendResponse(res, response.build('ERROR_SERVER_ERROR', { error }));
    }
  }; //End of Function