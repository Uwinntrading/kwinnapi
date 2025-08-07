const response = require("../../../../../util/response");
const { isValidObjectId } = require('../../../../../util/valueChecker');
const txnServices = require('../../../../services/transactionServices');
const { getTransactionNo } = require("../../../../services/counterService");
const { getIpAddress } = require('../../../../../util/utility');
const userServices = require('../../../../services/admin/v1/UserServices');
const { createLogs } = require("../../../../../util/logger");
/*********************************************************************************
 * Function Name    :   List
 * Purpose          :   This function is used for get transaction list
 * Created By       :   Afsar Ali
 * Created Data     :   29-05-2025
 * Updated By       :   
 * Update Data      :
 ********************************************************************************/
exports.list = async function (req, res) {
    try {
        const usrId = req.user.userId;
        const email = req.user.email;
        if(!isValidObjectId(usrId)){
            return response.sendResponse(res, response.build('PERMISSION_ERROR', { }));
        } else{
            const { condition={}, select ={}, limit, skip, sort={}, type }=req.body;
            let listWhere = {
                ...(type?{type:type}:null),
                ...(condition && {condition : condition}),
                ...(sort? {sort : sort}:{_id : -1}),
                ...(select? {select : select}:null),
                ...(limit?{limit : limit}: 10),
                ...(skip?{skip : skip}: 0)
            }
            const result = await txnServices.selectDetails(listWhere);
            if(!skip && !limit){
                createLogs(req, `${email} export transaction history.`,{});
            }
            if (result && type !== "single") {
                const countOption = {
                    type: "count",
                    ...(condition && { condition: condition }),
                };
                const count = await txnServices.selectDetails(countOption);
                return response.sendResponse(res, response.build("SUCCESS", { ...{ count: count }, result }));
            } else {
                return response.sendResponse(res, response.build("SUCCESS", { ...{ count: 0 }, result }));
            }
        }
    } catch (error) {

        return response.sendResponse(res, response.build('ERROR_SERVER_ERROR', { error }));
    }
}; //End of Function 

/*********************************************************************************
 * Function Name    :   reverse
 * Purpose          :   This function is used for reverse transaction
 * Created By       :   Afsar Ali
 * Created Data     :   09-06-2025
 * Updated By       :   
 * Update Data      :
 ********************************************************************************/
exports.reverse = async function (req, res) {
    try {
        const usrId = req.user.userId;
        const email = req.user.email;
        const { txn_id } = req.body;
        if(!isValidObjectId(usrId)){
            return response.sendResponse(res, response.build('PERMISSION_ERROR', { }));
        } else{
            let options = {
                type : 'single',
                condition : {_id : txn_id }
            }
            const txnData = await txnServices.selectDetails(options);
            createLogs(req, `${email} reverse transaction.`,{txnData});
            if(txnData && txnData?.status === 'A'){
                const ipAddress = await getIpAddress(req);
                //Debit Credits Amount
                if(txnData?.narration === 'Collect Amount' || txnData?.narration === 'Settled Amount'){
                    if(txnData?.credit_user){
                        const debitOption = {
                            user_id : txnData?.credit_user?._id,
                            amount : parseFloat(txnData?.amount),
                            record_type : "Debit",
                            narration : `Reverse ${txnData?.narration}`,
                            ipAddress : ipAddress,
                            created_by : usrId,
                            remarks : ""
    
                        }
                        await createTransaction(debitOption);
                    }

                    if(txnData?.debit_user){
                        const debitOption = {
                            user_id : txnData?.debit_user?._id,
                            amount : parseFloat(txnData?.amount),
                            record_type : "Credit",
                            narration : `Reverse ${txnData?.narration}`,
                            ipAddress : ipAddress,
                            created_by : usrId,
                            remarks : ""
    
                        }
                        await createTransaction(debitOption);
                    }

                    if(txnData?.from_user){
                        const creditOption = {
                            user_id : txnData?.from_user?._id,
                            amount : parseFloat(txnData?.amount),
                            ...(txnData?.record_type === 'Credit'?{
                                record_type : "Debit"
                            }:{
                                record_type : "Credit"
                            }),
                            narration : `Reverse ${txnData?.narration}`,
                            ipAddress : ipAddress,
                            created_by : usrId,
                            remarks : ""
                        }
                        await createTransaction(creditOption);
                    }

                    const updateTxnOption = {
                        condition : { _id : txn_id },
                        data : {
                            is_reverse : 'Y',
                        }
                    }
                    await txnServices.updateData(updateTxnOption);
                }
                //End
                return response.sendResponse(res, response.build("SUCCESS", {  }));
            } else{
                return response.sendResponse(res, response.build("NO_TRANSACTION_FOUND", {  }));
            }

        }
    } catch (error) {

        return response.sendResponse(res, response.build('ERROR_SERVER_ERROR', { error }));
    }
}; //End of Function 

const createTransaction = async (option)=>{
try {
    const { user_id, amount, record_type, narration, ipAddress, created_by, remarks } = option;
    const seqData = await getTransactionNo('crm_transactions');
    const userData = await userServices.getUserById(user_id);
    if(userData){
        const due_amount = parseFloat(userData?.due_amount);
        let total_due = parseFloat(due_amount);
        if(record_type === 'Credit'){
            total_due += parseFloat(amount);
        } else{
            total_due -= parseFloat(amount);
        }
        const updateData = {
            condition : { _id : user_id },
            data : {
                due_amount          : total_due,
                updated_at          : new Date(),
                updated_ip          : ipAddress
                }
        }
        await userServices.updateData(updateData);
        const params = {
            load_balance_id: seqData || 1,
            ...(record_type === 'Credit' ? {
                credit_user: userData?._id
            }:{
                debit_user: userData?._id
            }),
            amount : amount,
            before_amount : due_amount,
            after_amount : total_due,
            record_type : record_type,
            narration : narration,
            remarks : remarks || "",
            
            creation_ip : ipAddress,
            created_by : created_by,
            created_by_users_type : 'Admin',
            created_by_users_id : created_by,
            status : 'A',
        }
        return await txnServices.create(params);
    } 
    return true;
} catch (error) {
    
}
}
