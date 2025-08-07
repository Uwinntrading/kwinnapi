const response = require("../../../../../../util/response");
const invoiceServices = require("../../../../../services/invoiceServices");
const requestServices = require("../../../../../services/invoiceRequestService");
const {getInvoiceNo, getBatchNo } = require("../../../../../services/counterService");
const {isValidObjectId} = require("../../../../../../util/valueChecker");
const {getIpAddress} = require("../../../../../../util/utility");
const accountService = require("../../../../../services/admin/v1/UserServices");
const {getTransactionNo} =  require("../../../../../services/counterService");
const transactionService = require("../../../../../services/transactionServices");
const { createLogs } = require("../../../../../../util/logger");
/*********************************************************************************
 * Function Name    :   loadBalanceList
 * Purpose          :   This function is used for list of loadBalance
 * Created By       :   Afsar Ali
 * Created Data     :   04-04-2025
 * Updated By       :   
 * Update Data      :
 * Remarks          :
 ********************************************************************************/
exports.loadBalanceList = async function (req, res) {
    try {
        const { condition={}, select ={}, limit, skip, sort={}, type  }=req.body;
        let listWhere = {
            ...(condition? {condition : condition}:null),
            ...(sort? {sort : sort}:null),
            ...(select? {select : select}:null),
            ...(limit?{limit : limit}: 0),
            ...(skip?{skip : skip}: 0),
            ...(type?{type:type}:null)
        }
        const result = await invoiceServices.selectLoadBalance(listWhere);
        return response.sendResponse(res, response.build("SUCCESS", { result }));
    } catch (error) {
        console.log('error :', error);
        return response.sendResponse(res, response.build('ERROR_SERVER_ERROR', { error }));
    }
}; //End of Function

/*********************************************************************************
 * Function Name    :   usersList
 * Purpose          :   This function is used for list of loadBalance
 * Created By       :   Afsar Ali
 * Created Data     :   08-04-2025
 * Updated By       :   
 * Update Data      :
 * Remarks          :
 ********************************************************************************/
exports.usersList = async function (req, res) {
  try {
      const { condition={}, select ={}, limit, skip, sort={}, type  }=req.body;
      let listWhere = {
          ...(condition? {condition : condition}:null),
          ...(sort? {sort : sort}:null),
          ...(select? {select : select}:null),
          ...(limit?{limit : limit}: 0),
          ...(skip?{skip : skip}: 0),
          ...(type?{type:type}:null)
      }
      const result = await invoiceServices.selectUsers(listWhere);
      return response.sendResponse(res, response.build("SUCCESS", { result }));
  } catch (error) {
      console.log('error :', error);
      return response.sendResponse(res, response.build('ERROR_SERVER_ERROR', { error }));
  }
}; //End of Function

/*********************************************************************************
 * Function Name    :   invoiceList
 * Purpose          :   This function is used for list of loadBalance
 * Created By       :   Afsar Ali
 * Created Data     :   07-04-2025
 * Updated By       :   
 * Update Data      :
 * Remarks          :
 ********************************************************************************/
exports.invoiceList = async function (req, res) {
    try {
        const { condition={}, select ={}, limit, skip, sort={}, type  }=req.body;
        let listWhere = {
            ...(condition? {condition : condition}:null),
            ...(sort? {sort : sort}:null),
            ...(select? {select : select}:null),
            ...(limit?{limit : limit}: 0),
            ...(skip?{skip : skip}: 0),
            ...(type?{type:type}:null)
        }
        const result = await invoiceServices.selectInvoice(listWhere);
        if (result && type !== "single") {
          const countOption = {
            ...(condition ? { condition: condition } : null),
            type: "count",
          };
          const count = await invoiceServices.selectInvoice(countOption);
          return response.sendResponse(res, response.build("SUCCESS", { ...{ count: count }, result }));
        } else {
          return response.sendResponse(res, response.build("SUCCESS", { ...{ count: 0 }, result }));
        }
    } catch (error) {
        console.log('error :', error);
        return response.sendResponse(res, response.build('ERROR_SERVER_ERROR', { error }));
    }
}; //End of Function

/*********************************************************************************
 * Function Name    :   createInvoice
 * Purpose          :   This function is used for create invoice
 * Created By       :   Afsar Ali
 * Created Data     :   07-04-2025
 * Updated By       :
 * Update Data      :
 * Remarks          :
 ********************************************************************************/
exports.createInvoice = async function (req, res) {
    try {
        const email = req.user.email;
        const { invoice_date, users_id, users_oid, store, users_name, users_mobile, sales_person_name, area, pos_device_id, pos_number, payment_mode, start_date, end_date, start_time, end_time, total_sales, total_commission, total_paid, total_incentives, total_due, old_pending_balance, other_charges, sub_total_due,
        lottoTotalSales, lottoTotalCommission, lottoPaidAmount, lottoIncentives,         
        rechargeTotalSales, rechargeTotalCommission, rechargePaidAmount, rechargeIncentives, add_in_due
        } = req.body;
        let { invoice_no } = req.body;
        if(!invoice_no){
          invoice_no = await getInvoiceNo();
        }
        const ipAddress = await getIpAddress();
        const data = {
          invoice_no          : invoice_no,
          invoice_date        : invoice_date,
          
          users_id            : users_id,
          users_oid           : users_oid,
          store               : store?store:'N/A',        
          users_name          : users_name,
          users_mobile        : users_mobile,
          area                : area,
  
          sales_person_name   : sales_person_name?sales_person_name:'N/A',
  
          pos_device_id       : pos_device_id,
          pos_number          : pos_number,
          payment_mode        : payment_mode,
    
          start_date          : start_date,
          start_time          : start_time,
          end_date            : end_date,
          end_time            : end_time,
          due_date            : invoice_date,
  
          lottoTotalSales     : lottoTotalSales, 
          lottoTotalCommission    : lottoTotalCommission, 
          lottoPaidAmount     : lottoPaidAmount, 
          lottoIncentives     : lottoIncentives,       
  
          rechargeTotalSales    : rechargeTotalSales, 
          rechargeTotalCommission   : rechargeTotalCommission, 
          rechargePaidAmount    : rechargePaidAmount, 
          rechargeIncentives    : rechargeIncentives,
          
          total_sales         : total_sales,
          total_commission    : total_commission,
          total_paid          : total_paid,
          total_incentives    : total_incentives?total_incentives:0,
          total_due           : total_due,

          add_in_due          : add_in_due || 'N',
    
          old_pending_balance : old_pending_balance?old_pending_balance:0,
          other_charges       : other_charges?other_charges:0,
          sub_total_due       : sub_total_due,
    
          // created_by          : usrId,
          created_ip          : ipAddress || ':1',
          
          status              : "Completed" 
        }
    
        const result = await invoiceServices.insertInvoice(data);
        if(result && result?.add_in_due === 'Y'){
          const options ={
            _id : result?._id, 
            users_oid : users_oid, 
            sub_total_due : result?.sub_total_due, 
            created_ip : ipAddress, 
            created_by : null
          }
          await updateDueBalance(options);
        }
        createLogs(req, `${email} create invoice.`,result);
        return response.sendResponse(res, response.build("SUCCESS", {result}));
  } catch (error) {
      // console.log(error);
      return response.sendResponse(
        res,
        response.build("ERROR_SERVER_ERROR", { error })
      );
    }
  }; //End of Function

const updateDueBalance = async (options) => {
try {
  const { _id, users_oid, sub_total_due, created_ip = null, created_by } = options;
  const userOption = {
    type : 'single',
    condition : {
      _id : users_oid
    },
    select : { due_amount : true, bind_person_id : true }
  }
  const userData = await accountService.select(userOption);
  if(userData) {
    let due_amount = userData?.due_amount || 0;
    let amount = sub_total_due - due_amount;

    let avl_due_amount = due_amount + amount
    
    const seq_no = await getTransactionNo('crm_transactions');
    const params = {
      load_balance_id: seq_no || 1,
      invoice_data : _id,
      // debit_user: { type: Schema.Types.ObjectId },
      credit_user : users_oid,
      amount : amount,
      before_amount : due_amount,
      after_amount : avl_due_amount,
      record_type : 'Credit',
      narration : 'Invoice',
      // remarks : { type: String },
      
      ...(created_ip && {creation_ip : created_ip}),
      created_by : created_by,
      created_by_users_type : 'Admin',
      created_by_users_id : created_by,
      status : 'A',
    }
    await transactionService.create(params);

    const updateUser = {
      condition : {_id : users_oid},
      data : {
        old_due_amount : due_amount || 0,
        due_amount : avl_due_amount, 
      }
    }
    const updatedUser = await accountService.updateData(updateUser);
    
  }
} catch (error) {
  console.log('error : ', error);
}
}
  
/*********************************************************************************
 * Function Name    :   updateInvoiceData
 * Purpose          :   This function is used for Login Admin Dashboard
 * Created By       :   Afsar Ali
 * Created Data     :   19-NOV-2024
 * Updated By       :
 * Update Data      :
 * Remarks          :
 ********************************************************************************/
exports.updateInvoiceData = async function (req, res) {
    try {
      // const usrId = req.user.userId;
      // if(!isValidObjectId(usrId)){
      //   return response.sendResponse(res,response.build("UNAUTHORIZED", { error: "Invalid or Expired Token" }));
      // } else {
        const { id, invoice_date, payment_mode, total_sales, total_commission, total_paid, total_incentives, total_due, old_pending_balance, other_charges, sub_total_due, status, remarks, 
          lottoTotalSales, lottoTotalCommission, lottoPaidAmount, lottoIncentives,         
          rechargeTotalSales, rechargeTotalCommission, rechargePaidAmount, rechargeIncentives,
         } = req.body;
        let { invoice_no } = req.body;
        if(!invoice_no){
          invoice_no = await getInvoiceNo();
        }
        const data = {
          ...(invoice_no ? {invoice_no : invoice_no}:null),
          ...(invoice_date ? {
              invoice_date : invoice_date, 
              due_date : invoice_date
            }:null),
          ...(payment_mode ? {payment_mode : payment_mode}:null),
  
            ...(lottoTotalSales && {lottoTotalSales     : lottoTotalSales}), 
            ...(lottoTotalCommission && {lottoTotalCommission    : lottoTotalCommission}), 
            ...(lottoPaidAmount && {lottoPaidAmount     : lottoPaidAmount}), 
            ...(lottoIncentives && {lottoIncentives     : lottoIncentives}),       
  
            ...(rechargeTotalSales && {rechargeTotalSales    : rechargeTotalSales}), 
            ...(rechargeTotalCommission && {rechargeTotalCommission   : rechargeTotalCommission}), 
            ...(rechargePaidAmount && {rechargePaidAmount    : rechargePaidAmount}), 
            ...(rechargeIncentives && {rechargeIncentives    : rechargeIncentives}),
  
          ...(total_sales ? {total_sales : total_sales}:null),
          ...(total_commission ? {total_commission : total_commission}:null),
          ...(total_paid ? {total_paid : total_paid}:null),
          ...(total_incentives ? {total_incentives : total_incentives}:null),
          ...(total_due ? {total_due : total_due}:null),
          ...(old_pending_balance ? {old_pending_balance : old_pending_balance}:null),
          ...(other_charges ? {other_charges : other_charges}:null),
          ...(sub_total_due ? {sub_total_due : sub_total_due}:null),
          ...(status ? {status : status}:null),
          ...(remarks ? {remarks : remarks}:null)
        }
        const options = {
          condition : { _id : id },
          data : data
        }
        const result = await invoiceServices.updateInvoice(options);
        if(result && result?.add_in_due === 'Y' && result?.status === 'Completed'){
          const options ={
            _id : result?._id, 
            users_oid : result?.users_oid, 
            sub_total_due : result?.sub_total_due, 
            created_by : null
          }
          await updateDueBalance(options);
        }
        return response.sendResponse(res, response.build("SUCCESS", {result}));
      // }
  } catch (error) {
      // console.log(error);
      return response.sendResponse(
        res,
        response.build("ERROR_SERVER_ERROR", { error })
      );
    }
  }; //End of Function

  
  /*********************************************************************************
   * Function Name    :   deleteInvoice
   * Purpose          :   This function is used delete invoice
   * Created By       :   Afsar Ali
   * Created Data     :   08-04-2025
   * Updated By       :   
   * Update Data      :
   * Remarks          :
   ********************************************************************************/
  exports.deleteInvoice = async function (req, res) {
    try {
        // const usrId = req.user.userId;
        const id = req?.params?.id;
        if(!isValidObjectId(id)){
              return response.sendResponse(res, response.build('ID_ERROR', { }));
        } else{
            await invoiceServices.deleteOne(id);
            return response.sendResponse(res, response.build('SUCCESS', { }));
        }
    } catch (error) {
      console.log('error : ',error);
        return response.sendResponse(res, response.build('ERROR_SERVER_ERROR', { error }));
    }
  }; //End of Function

  /*********************************************************************************
 * Function Name    :   createRequest
 * Purpose          :   This function is used for create request
 * Created By       :   Afsar Ali
 * Created Data     :   20-NOV-2024
 * Updated By       :
 * Update Data      :
 * Remarks          :
 ********************************************************************************/
exports.createRequest = async function (req, res) {
    try {
      const email = req.user.email;
      // if(!isValidObjectId(usrId)){
      //   return response.sendResponse(res,response.build("UNAUTHORIZED", { error: "Invalid or Expired Token" }));
      // } else {
        const { users_oid,users_id,store,users_name,users_mobile,invoice_date,payment_mode,start_date,end_date, retailerList, start_time, end_time, add_in_due } = req.body;
        const created_ip = await getIpAddress(req);
        const batch_no = await getBatchNo();
       
        const data = {
          batch_no            : batch_no,
          invoice_date        : invoice_date,
          
          users_id            : users_id,
          users_oid           : users_oid,
          store               : store?store:'N/A',        
          users_name          : users_name,
          users_mobile        : users_mobile,
          payment_mode        : payment_mode,
    
          start_date          : start_date,
          end_date            : end_date,
  
          ...(start_time && {start_time : start_time}),
          ...(end_time && {end_time : end_time}),
  
          due_date            : invoice_date,
          add_in_due          : add_in_due || 'N',
          // created_by          : usrId,
          created_ip          : created_ip || ':1',
          
          status              : "Pending" 
        }
    
        const result = await requestServices.create(data);
        if(result && retailerList?.length > 0){
            const invoiceDataArray = await Promise.all(retailerList.map(async (item) => {
                
                const invoice_no = await getInvoiceNo();
                const user_name = `${item?.users_name}`
                return {
                    batch_no: batch_no,
                    invoice_no: invoice_no,
                    invoice_date: invoice_date,
                    users_id: item.users_id,
                    users_oid: item._id,
                    store: item?.store_name?item.store_name:'N/A',
                    area: item?.area?item.area:'N/A',
                    sales_person_name: item?.bind_person_name?item.bind_person_name:'N/A',
                    users_name: user_name?user_name:'N/A',
                    users_mobile: item?.users_mobile,
                    pos_number: item.pos_number,
                    pos_device_id: item.pos_device_id,
                    payment_mode: payment_mode,
                    start_date: start_date,
                    end_date: end_date,
                    ...(start_time && {start_time : start_time}),
                    ...(end_time && {end_time : end_time}),
                    due_date: invoice_date,
                    add_in_due          : add_in_due || 'N',
                    created_by: users_oid,
                    status: 'Pending'
                };
            }));
            await invoiceServices.bulk_create(invoiceDataArray);
        }
        createLogs(req, `${email} create bulk invoice.`,result);
        return response.sendResponse(res, response.build("SUCCESS", {result}));
      // }
  } catch (error) {
      console.log(error);
      return response.sendResponse( res, response.build("ERROR_SERVER_ERROR", { error }) );
    }
  }; //End of Function
  
  /*********************************************************************************
   * Function Name    :   requestList
   * Purpose          :   This function is used for request list of invoices
   * Created By       :   Afsar Ali
   * Created Data     :   20-NOV-2024
   * Updated By       :   
   * Update Data      :
   * Remarks          :
   ********************************************************************************/
  exports.requestList = async function (req, res) {
    try {
        // const usrId = req.user.userId;
        // if(!isValidObjectId(usrId)){
        //     return response.sendResponse(res, response.build('PERMISSION_ERROR', { }));
        // } else{
            const { condition={}, select ={}, limit, skip, sort={}, type  }=req.body;
            
            let listWhere = {
                ...(condition? {condition : condition}:null),
                ...(sort? {sort : sort}:null),
                ...(select? {select : select}:null),
                ...(limit?{limit : limit}: 0),
                ...(skip?{skip : skip}: 0),
                ...(type?{type:type}:null)
            }
            const result = await requestServices.select(listWhere);
            if (result && type !== "single") {
              const countOption = {
                ...(condition ? { condition: condition } : null),
                type: "count",
              };
              const count = await requestServices.select(countOption);
              return response.sendResponse(res, response.build("SUCCESS", { ...{ count: count }, result }));
            } else {
              return response.sendResponse(res, response.build("SUCCESS", { ...{ count: 0 }, result }));
            }
        // }
    } catch (error) {
        return response.sendResponse(res, response.build('ERROR_SERVER_ERROR', { error }));
    }
  }; //End of Function 
  
  /*********************************************************************************
   * Function Name    :   deleteRequest
   * Purpose          :   This function is used delete invoice
   * Created By       :   Afsar Ali
   * Created Data     :   20-NOV-2024
   * Updated By       :   
   * Update Data      :
   * Remarks          :
   ********************************************************************************/
  exports.deleteRequest = async function (req, res) {
    try {
        // const usrId = req.user.userId;
        const id = req?.params?.id;
        // if(!isValidObjectId(usrId)){
        //     return response.sendResponse(res, response.build('PERMISSION_ERROR', { }));
        // } else 
        if(!id){
              return response.sendResponse(res, response.build('ID_ERROR', { }));
        } else{
            await requestServices.deleteOne(id);
            return response.sendResponse(res, response.build('SUCCESS', { }));
        }
    } catch (error) {
        return response.sendResponse(res, response.build('ERROR_SERVER_ERROR', { error }));
    }
  }; //End of Function
  
  /*********************************************************************************
   * Function Name    :   Request Change status
   * Purpose          :   This function is used delete invoice
   * Created By       :   Afsar Ali
   * Created Data     :   27-NOV-2024
   * Updated By       :   
   * Update Data      :
   * Remarks          :
   ********************************************************************************/
  exports.requestChangeStatus = async function (req, res) {
    try {
        // const usrId = req.user.userId;
        const id = req?.params?.id;
        // if(!isValidObjectId(usrId)){
        //   return response.sendResponse(res, response.build('PERMISSION_ERROR', { }));
        // } else 
        if(!id){
          return response.sendResponse(res, response.build('ID_ERROR', { }));
        } else{
          const pendingOption = {
            type : 'count',
            condition : { batch_no : id, status : "Pending" }
          }
          const isPending = await requestServices.select(pendingOption);
          if(isPending > 0){
            const options = {
              condition : { batch_no  : id},
              data : { status : "Complete" }
            }
            const rr = await requestServices.updateData(options);
            console.log('rr : ',rr);
          }
          return response.sendResponse(res, response.build('SUCCESS', { }));
        }
    } catch (error) {
        return response.sendResponse(res, response.build('ERROR_SERVER_ERROR', { error }));
    }
  }; //End of Function
