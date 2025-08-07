const response = require("../../../../../../util/response");
const {isValidObjectId} = require('../../../../../../util/valueChecker');
const loadbalanceServices = require('../../../../../services/front/v1/loadbalanceServices');
const userServices = require('../../../../../services/front/v1/userServices');
const recharge_api = require('../../../../../../util/rechargeAPIs');
const rechargeServices = require('../../../../../services/front/v1/rechargeServices');
const Counter =  require('../../../../../services/counterService');
const { loginIP, stringToObjectId } = require("../../../../../../util/utility");
/*********************************************************************************
 * Function Name    :   list
 * Purpose          :   This function is used to get operator 
 * Created By       :   Afsar Ali
 * Created Data     :   30-11-2024
 * Updated By       :   
 * Update Data      :
 * Remarks          :
 **********************************************************************************/
exports.getOperator = async function (req, res) {
    try {  
        const { mobile_no } = req.body;
        if(!mobile_no){ 
            return response.sendResponse(res, response.build('PHONE_EMPTY', { }));
        } else {
            const accountData = await recharge_api.getAccountLookup(mobile_no);
            if(accountData.status === false){
                return response.sendResponse(res, response.build('SUCCESS', { result : "Account data not found."}));
            } else {
                const currentAccountData = accountData.result;
                const CountryIso = currentAccountData.CountryIso;
                const RegionCode = currentAccountData.Items[0].RegionCode;
                const option1 = {
                    countryIsos : CountryIso,
                    regionCodes : RegionCode,
                    accountNumber : mobile_no
                }
                const accountProvider = await recharge_api.getProvider(option1);
                let allPlans = [];
                if(accountProvider.status === true){
                    const option2 = {
                        countryIsos : CountryIso,
                        regionCodes : RegionCode,
                        accountNumber : mobile_no,
                        providerCodes : accountProvider.result.Items[0].ProviderCode
                    }
                    const accountPlans = await recharge_api.getPlans(option2);
                    if(accountPlans.status === true){
                        allPlans = accountPlans.result.Items;
                    }
                }

                const result = {
                    mobile_no : mobile_no,
                    countryIso : CountryIso,
                    regionCode : RegionCode,
                    ...(accountProvider.status === true?{accountProvider : accountProvider.result.Items }:{accountProvider : []}),
                    ...(allPlans.length > 0?{allPlans : allPlans} : null)
                }
                return response.sendResponse(res, response.build('SUCCESS', { result}));
            }
        }
    } catch(error){
        return response.sendResponse(res, response.build('ERROR_SERVER_ERROR', { error }));
    }
}

/*********************************************************************************
 * Function Name    :   getAllProvider
 * Purpose          :   This function is used to product get all provider
 * Created By       :   Afsar Ali
 * Created Data     :   30-11-2024
 * Updated By       :   
 * Update Data      :
 * Remarks          :
 **********************************************************************************/
exports.getAllProvider = async function (req, res) {
    try {  
        const { countryIsos, regionCodes } = req.body;
        if(!countryIsos && !regionCodes){ 
            return response.sendResponse(res, response.build('ISOS_REGION_EMPTY', { }));
        }else {
            const option = {
                countryIsos : countryIsos,
                regionCodes : regionCodes
            }
            const accountProvider = await recharge_api.getProvider(option);
            const result = {
                countryIso  : countryIsos,
                regionCodes : regionCodes,
                ...(accountProvider.status === true?{accountProvider : accountProvider.result.Items }:{accountProvider : []}),
            }
            return response.sendResponse(res, response.build('SUCCESS', { result }));
        }
    } catch(error){
        console.log('error',error);
        return response.sendResponse(res, response.build('ERROR_SERVER_ERROR', { error }));
    }
}

/*********************************************************************************
 * Function Name    :   list
 * Purpose          :   This function is used to get all plans 
 * Created By       :   Afsar Ali
 * Created Data     :   30-11-2024
 * Updated By       :   
 * Update Data      :
 * Remarks          :
 **********************************************************************************/
exports.getAllPlans = async function (req, res) {
    try {  
        const { countryIsos, regionCodes, providerCodes } = req.body;
        if(!countryIsos && !regionCodes){ 
            return response.sendResponse(res, response.build('ISOS_REGION_EMPTY', { }));
        } else if(!providerCodes){
            return response.sendResponse(res, response.build('PROVIDER_EMPTY', { }));
        } else {
            let allPlans = [];
            const option2 = {
                countryIsos : countryIsos,
                regionCodes : regionCodes,
                providerCodes : providerCodes
            }
            const accountPlans = await recharge_api.getPlans(option2);
            if(accountPlans.status === true){
                allPlans = accountPlans.result.Items;
            }
            return response.sendResponse(res, response.build('SUCCESS', { result : allPlans }));
        }
    } catch(error){
        console.log('error',error);
        return response.sendResponse(res, response.build('ERROR_SERVER_ERROR', { error }));
    }
}

/*********************************************************************************
 * Function Name    :   createRecharge
 * Purpose          :   This function is used to create recharge 
 * Created By       :   Afsar Ali
 * Created Data     :   30-11-2024
 * Updated By       :   
 * Update Data      :
 * Remarks          :
 **********************************************************************************/
exports.createRecharge = async function (req, res) {
    try {  
        const userId = req.user.userId;
        const { SkuCode, SendValue, mobile_no, SendCurrencyIso } = req.body;
        if(!SkuCode){ 
            return response.sendResponse(res, response.build('ISOS_REGION_EMPTY', { }));
        } else if(!SendValue){
            return response.sendResponse(res, response.build('PROVIDER_EMPTY', { }));
        } else if(!mobile_no){
            return response.sendResponse(res, response.build('PROVIDER_EMPTY', { }));
        } else if(!SendCurrencyIso){
            return response.sendResponse(res, response.build('PROVIDER_EMPTY', { }));
        } else {
            const userData = await userServices.getUserById(userId);
            if(userData.availableArabianPoints >= SendValue){
                let result = [];
                const distributorRef = await Counter.getSequence('recharges');
                const postData = {
                    SkuCode : SkuCode,
                    SendValue : SendValue,
                    AccountNumber : parseInt(mobile_no),
                    DistributorRef : `KWINN${distributorRef.seq}`,
                    ValidateOnly : true,
                    SendCurrencyIso : SendCurrencyIso
                }
                const accountPlans = await recharge_api.sendTransferByAxios(postData);
                result = accountPlans;
                if(accountPlans.status === true){
                    const data = accountPlans.result;
                    const ipAddress = await loginIP();
                    const param = {
                        TransferRef     : data?.TransferId?.TransferRef,
                        DistributorRef  : `KWINN${distributorRef.seq}`,
                        SkuCode         : SkuCode,
                        Price           : data.TransferRecord.Price,
                        CommissionApplied : data.TransferRecord.CommissionApplied,
                        ProcessingState : data.TransferRecord.ProcessingState,
                        AccountNumber   : mobile_no,
                        
                        creation_ip : ipAddress || ':1',
                        created_by : userId
                    }
                    const insertRecharge = await rechargeServices.createDate(param);
                    const debitOption = {
                        userId : userId,
                        availableArabianPoints : userData.availableArabianPoints,
                        debit_amount : SendValue,
                        mobile_no : mobile_no,
                        rechargeId : `KWINN${distributorRef.seq}`,
                        rechargeOid : insertRecharge._id
                    }
                    debitPoints(debitOption);
                    result = accountPlans.result;
                }
                return response.sendResponse(res, response.build('SUCCESS', { result : result }));
            }else {
                return response.sendResponse(res, response.build('BALANCE_ERROR', { }));
            }
        }
    } catch(error){
        console.log('error',error);
        return response.sendResponse(res, response.build('ERROR_SERVER_ERROR', { error }));
    }
}

const debitPoints = async (options) => {
    try {
        const { userId,availableArabianPoints,debit_amount,mobile_no,rechargeId,rechargeOid }=options;
        const points = parseFloat(availableArabianPoints) - parseFloat(debit_amount);
        const option = {
            condition : { _id : stringToObjectId(userId) },
            data : {
                availableArabianPoints : points
            }
        }
        await userServices.updateData(option);
        const sequence = await Counter.getSequence('kw_loadBalance');
        const ipAddress = await loginIP();
        const param = {
            load_balance_id         : sequence.seq,
            rechargeId              : rechargeId,
            rechargeData            : rechargeOid,
            debit_user              : userId,
            points                  : debit_amount,
            availableArabianPoints  : availableArabianPoints,
            end_balance             : points,
            mobile_no               : mobile_no,
            record_type             : "Debit",
            narration               : 'Mobile Recharge',
            remarks                 : `${debit_amount} recharge to ${mobile_no}`,
            creation_ip             : ipAddress,
            created_at              : new Date(),
            created_by              : userId,
            status                  : "A"
        }
        await loadbalanceServices.createData(param);
        return true;
    } catch (error) {
        console.log('error', error);
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

  exports.getCountries = async function (req, res) {
    try {
        const data = await recharge_api.getAllCountries();
        if(data?.status === true){
            const result = data.result;
            return response.sendResponse(res, response.build('SUCCESS', { result }));
        } else{
            return response.sendResponse(res, response.build('SUCCESS', { result : [] }));
        }
    } catch (error) {
        console.log('error',error);
        return response.sendResponse(res, response.build('ERROR_SERVER_ERROR', { error }));
    }
}