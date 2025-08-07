const response = require("../../../../../../util/response");
const { isValidObjectId } = require("../../../../../../util/valueChecker");
const adminService = require("../../../../../services/crm/superAdminServices");
const userServices = require("../../../../../services/front/v1/userServices");
const transactionService = require("../../../../../services/transactionServices");
const { getIpAddress } = require("../../../../../../util/utility");
const { getTransactionNo } = require("../../../../../services/counterService");
const { createLogs } = require("../../../../../../util/logger");
/*********************************************************************************
 * Function Name    :   getAdminUsers
 * Purpose          :   This function is used for get admin users list
 * Created By       :   Afsar Ali
 * Created Data     :   23-JAN-2024
 * Updated By       :   
 * Update Data      :
 * Remarks          :
 ********************************************************************************/
exports.list = async function (req, res) {
  try {
      const usrId = req.user.userId;
      if(!isValidObjectId(usrId)){
          return response.sendResponse(res, response.build('PERMISSION_ERROR', { }));
      } else{
          const { condition={}, select ={}, limit, skip, sort={}, populate={}, type  } = req.body;
          let listWhere = {
              condition : {
                  ...condition,
                  admin_type : "Sub Admin"
              },
              ...(sort? {sort : sort}:null),
              ...(select? {select : select}:null),
              ...(limit?{limit : limit}: 10),
              ...(skip?{skip : skip}: 0),
              ...(populate?{populate : populate}:null),
              ...(type?{type:type}:null)
          }
          const result = await userServices.select(listWhere);

          if(result && type !== 'single'){
              const countOption = {
                  ...(condition? {condition : condition}:null),
                  type:'count'
              }
              const count = await userServices.select(countOption);
              return response.sendResponse(res, response.build('SUCCESS', { ...{count:count}, result }));
          } else {
              return response.sendResponse(res, response.build('SUCCESS', { ...{count:0}, result }));
          }
      }
  } catch (error) {
      console.log(error);
      return response.sendResponse(res, response.build('ERROR_SERVER_ERROR', { error }));
  }
}; //End of Function 

/*********************************************************************************
 * Function Name    :   settleDueAmount
 * Purpose          :   This function is used for manage due amount
 * Created By       :   Afsar Ali
 * Created Data     :   30-05-2025
 * Updated By       :   
 * Update Data      :
 ********************************************************************************/
exports.settleDueAmount = async function (req, res) {
    try {
        const usrId = req.user.userId;
        const email = req.user.email;
        const {user_id, amount} = req.body;
        if(!isValidObjectId(usrId) || !isValidObjectId(user_id)){
            return response.sendResponse(res, response.build('PERMISSION_ERROR', { }));
        } else{
            const userData = await userServices.getUserById(user_id);
            if(userData){
                const ipAddress = await getIpAddress(req);
                let due_amount = userData?.due_amount || 0;
                let total_due = due_amount + parseFloat(amount);

                const updateData = {
                    condition : { _id : user_id },
                    data : {
                        due_amount          : total_due,
                        updated_at          : new Date(),
                        updated_ip          : ipAddress
                     }
                }
                const result = await userServices.updateData(updateData);
                if(result){
                    const seqData = await getTransactionNo('crm_transactions');
                    const params = {
                        load_balance_id: seqData?.seq || 1,
                        credit_user: user_id,
                        amount : amount,
                        before_amount : due_amount,
                        after_amount : total_due,
                        record_type : 'Credit',
                        narration : 'Settled Amount',
                        remarks : `${amount} amount settled from ${userData?.user_name}`,
                        
                        creation_ip : ipAddress,
                        created_by : usrId,
                        created_by_users_type : 'Admin',
                        created_by_users_id : usrId,
                        status : 'A',
                    }
                    await transactionService.create(params);
                    createLogs(req, `${email} settle due amount.`,params);
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
 * Function Name    :   collectDueAmount
 * Purpose          :   This function is used for manage due amount
 * Created By       :   Afsar Ali
 * Created Data     :   30-05-2025
 * Updated By       :   
 * Update Data      :
 ********************************************************************************/
exports.collectDueAmount = async function (req, res) {
    try {
        const usrId = req.user.userId;
        const email = req.user.email;
        const {user_id, amount} = req.body;
        if(!isValidObjectId(usrId) || !isValidObjectId(user_id)){
            return response.sendResponse(res, response.build('PERMISSION_ERROR', { }));
        } else{
            const userData = await userServices.getUserById(user_id);
            if(userData){
                const ipAddress = await getIpAddress(req);
                let due_amount = userData?.due_amount || 0;
                let total_due = due_amount - parseFloat(amount);

                const updateData = {
                    condition : { _id : user_id },
                    data : {
                        due_amount          : total_due,
                        updated_at          : new Date(),
                        updated_ip          : ipAddress
                     }
                }
                const result = await userServices.updateData(updateData);
                if(result){
                    const seqData = await getTransactionNo('crm_transactions');
                    const params = {
                        load_balance_id: seqData?.seq || 1,
                        debit_user: user_id,
                        amount : amount,
                        before_amount : due_amount,
                        after_amount : total_due,
                        record_type : 'Debit',
                        narration : 'Collect Amount',
                        remarks : `${amount} amount collect from ${userData?.user_name}`,
                        
                        creation_ip : ipAddress,
                        created_by : usrId,
                        created_by_users_type : 'Admin',
                        created_by_users_id : usrId,
                        status : 'A',
                    }
                    await transactionService.create(params);
                    createLogs(req, `${email} collect due amount.`,params);
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
 * Function Name    :   updateCollection
 * Purpose          :   This function is used for update due amount
 * Created By       :   Afsar Ali
 * Created Data     :   31-05-2025
 * Updated By       :   
 * Update Data      :
 ********************************************************************************/
exports.updateCollection = async function (req, res) {
    try {
        const usrId = req.user.userId;
        const email = req.user.email;
        const {mobile, amount, type} = req.body;
        if(!isValidObjectId(usrId)){
            return response.sendResponse(res, response.build('PERMISSION_ERROR', { }));
        } else{
            const userOption = {
                type : "single",
                condition : {users_mobile : parseInt(mobile)},
                select : { _id : true, due_amount : true, users_name : true}
            }
            const userData = await userServices.select(userOption);
            if(userData){
                const ipAddress = await getIpAddress(req);
                let due_amount = userData?.due_amount || 0;
                let total_due = parseFloat(due_amount);
                if(type === 'Settle'){
                    total_due += parseFloat(amount);
                } else{
                    total_due -= parseFloat(amount);
                }

                const updateData = {
                    condition : { _id : userData?._id },
                    data : {
                        due_amount          : total_due,
                        updated_at          : new Date(),
                        updated_ip          : ipAddress
                     }
                }
                const result = await userServices.updateData(updateData);
                if(result){
                    const seqData = await getTransactionNo('crm_transactions');
                    const params = {
                        load_balance_id: seqData?.seq || 1,
                        amount : amount,
                        before_amount : due_amount,
                        after_amount : total_due,
                        ...(type?.toUpperCase() === 'SETTLE'
                            ? { narration: 'Settled Amount', record_type: 'Credit', credit_user: userData?._id }
                            : { narration: 'Collect Amount', record_type: 'Debit', debit_user: userData?._id }
                        ),
                        remarks : `${amount} amount ${type} from ${userData?.user_name}`,
                        creation_ip : ipAddress,
                        created_by : usrId,
                        created_by_users_type : 'Admin',
                        created_by_users_id : usrId,
                        status : 'A'
                    }
                    await transactionService.create(params);
                    createLogs(req, `${email} update due amount.`,params);
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
 * Function Name    :   updateDueAmount
 * Purpose          :   This function is used for update due amount
 * Created By       :   Afsar Ali
 * Created Data     :   19-06-2025
 * Updated By       :   
 * Update Data      :
 * Remarks          :
 ********************************************************************************/
exports.updateDueAmount = async function (req, res) {
  try {
      const usrId = req.user.userId;
      const {id, old_due_amount, due_amount} = req.body;
      if(!isValidObjectId(usrId) && !isValidObjectId(id)){
          return response.sendResponse(res, response.build('PERMISSION_ERROR', { }));
      } else{
          let listWhere = {
              condition : { _id : id },
              data : {
                ...(old_due_amount && {old_due_amount : old_due_amount}),
                ...(due_amount && {due_amount : due_amount})
              }
          }
          const result = await userServices.updateData(listWhere);

          return response.sendResponse(res, response.build('SUCCESS', { result }));
      }
  } catch (error) {
      console.log(error);
      return response.sendResponse(res, response.build('ERROR_SERVER_ERROR', { error }));
  }
}; //End of Function 
