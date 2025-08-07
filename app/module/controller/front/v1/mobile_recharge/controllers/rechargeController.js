const response = require("../../../../../../util/response");
const {isValidObjectId} = require('../../../../../../util/valueChecker');
const loadbalanceServices = require('../../../../../services/front/v1/loadbalanceServices');
const userServices = require('../../../../../services/front/v1/userServices');
const recharge_api = require('../../../../../../util/rechargeAPIs');
const rechargeServices  = require('../../../../../services/front/v1/rechargeServices');
const Counter =  require('../../../../../services/counterService');
const { loginIP, stringToObjectId } = require("../../../../../../util/utility");
/*********************************************************************************
 * Function Name    :   getCountries
 * Purpose          :   This function is used to get countries 
 * Created By       :   Afsar Ali
 * Created Data     :   30-11-2024
 * Updated By       :   
 * Update Data      :
 * Remarks          :
 **********************************************************************************/
exports.getCountries = async function (req, res) {
    try {
        const result = await rechargeServices.selectCountry();
        if(result){
            return response.sendResponse(res, response.build('SUCCESS', { result }));
        } else{
            return response.sendResponse(res, response.build('SUCCESS', { result : [] }));
        }
    } catch (error) {
        console.log('error',error);
        return response.sendResponse(res, response.build('ERROR_SERVER_ERROR', { error }));
    }
}
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
            // return response.sendResponse(res, response.build('SUCCESS', { accountData}));
            if(accountData.status === false){
                return response.sendResponse(res, response.build('SUCCESS', { result : "Account data not found."}));
            } else {
                const currentAccountData = accountData.result;
                const CountryIso = currentAccountData.CountryIso;
                const RegionCode = currentAccountData.Items[0]?.RegionCode;
                const ProviderCode = currentAccountData.Items[0]?.ProviderCode;

                const providerOption ={ condition : { CountryIso :  CountryIso } }
                const AllProvider = await rechargeServices.selectProviders(providerOption);

                const plansOptions = { condition : { ProviderCode : ProviderCode } }
                const AllPlans = await rechargeServices.selectPlans(plansOptions);
                const result = {
                    mobile_no : mobile_no,
                    countryIso : CountryIso,
                    regionCode : RegionCode,
                    currentAccountData : currentAccountData,
                    AllProvider : AllProvider,
                    AllPlans : AllPlans
                }
                return response.sendResponse(res, response.build('SUCCESS', { result}));
            }
        }
    } catch(error){
        console.log(error);
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
                condition : {
                    ...(countryIsos?{CountryIso : countryIsos}:null),
                    ...(regionCodes?{RegionCodes : regionCodes}:null)
                }
            }
            const result = await rechargeServices.selectProviders(option);
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
        const { providerCodes } = req.body;
        if(!providerCodes){
            return response.sendResponse(res, response.build('PROVIDER_EMPTY', { }));
        } else {
            const option = { condition : { ProviderCode : providerCodes } }
            const result = await rechargeServices.selectPlans(option);
            return response.sendResponse(res, response.build('SUCCESS', { result }));
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
       
        
        const { SkuCode, SendValue, mobile_no, SendCurrencyIso, ProviderCode , markUpValue } = req.body;
        if(!SkuCode){ 
            return response.sendResponse(res, response.build('ISOS_REGION_EMPTY', { }));
        } else if(!SendValue){
            return response.sendResponse(res, response.build('PROVIDER_EMPTY', { }));
        } else if(!mobile_no){
            return response.sendResponse(res, response.build('PROVIDER_EMPTY', { }));
        } else if(!SendCurrencyIso){
            return response.sendResponse(res, response.build('PROVIDER_EMPTY', { }));
        } else if(!ProviderCode){
            return response.sendResponse(res, response.build('PROVIDER_EMPTY', { }));
        } else if(!markUpValue){
            return response.sendResponse(res, response.build('MARKUPFEE_EMPTY', { }));
        } else {
            const userData = await userServices.getUserById(userId);
            if(userData.availableReachargePoints >= markUpValue){
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
                const accountPlans = await recharge_api.sendTransfer(postData);
                result = accountPlans;
                if(accountPlans.status === true){
                    const providerOption = {
                        type : 'single',
                        condition : { ProviderCode : ProviderCode }
                    }
                    const providerData = await rechargeServices.selectProviders(providerOption);
                    const data = accountPlans.result;
                    const ipAddress = await loginIP();
                    const commissionPercentage = parseFloat(userData?.international_recharge_commission_percentage)
                    const CommissionAmount     = markUpValue * (commissionPercentage/100);

                    const param = {
                        TransferRef     : data?.TransferRecord?.TransferId?.TransferRef,
                        DistributorRef  : `KWINN${distributorRef.seq}`,
                        SkuCode         : SkuCode,
                        Price           : data.TransferRecord.Price,
                        CommissionApplied : data.TransferRecord.CommissionApplied,
                        ProcessingState : data.TransferRecord.ProcessingState,
                        markUpValue     : parseFloat(markUpValue),
                        commission      : parseFloat(CommissionAmount),
                        AccountNumber   : mobile_no,
                        ProviderCode    : ProviderCode,
                        providerName    : providerData?.Name,
                        providerLogo    : providerData?.LogoUrl,
                        providerData    : JSON.stringify(providerData),
                        creation_ip     : ipAddress || ':1',
                        created_by      : userId
                    }
                    const insertRecharge = await rechargeServices.createDate(param);
                    const debitOption = {
                        userId : userId,
                        availableArabianPoints   : userData.availableArabianPoints,
                        availableReachargePoints : userData.availableReachargePoints,
                        debit_amount : markUpValue,
                        mobile_no : mobile_no,
                        rechargeId : `KWINN${distributorRef.seq}`,
                        rechargeOid : insertRecharge._id
                    }
                    await debitPoints(debitOption);

                    if(insertRecharge && markUpValue > 0  && CommissionAmount != '' ){
                        const creditCommission = {
                            userId : userId,
                            availableArabianPoints   : userData.availableArabianPoints,
                            availableReachargePoints : parseFloat(debitOption.availableReachargePoints) - parseFloat(debitOption.debit_amount),
                            credit_amount : CommissionAmount,
                            mobile_no : mobile_no,
                            rechargeId : `KWINN${distributorRef.seq}`,
                            rechargeOid : insertRecharge._id
                        }
                        creditPoints(creditCommission);
                     }
                   
                    result = accountPlans.result;
                    return response.sendResponse(res, response.build('SUCCESS', { result : insertRecharge }));
                } else {
                    return response.sendResponse(res, response.build('SUCCESS', { result : result }));
                }
            }else {
                return response.sendResponse(res, response.build('BALANCE_ERROR', { }));
            }
        }
    } catch(error){
        console.log('error11',error);
        return response.sendResponse(res, response.build('ERROR_SERVER_ERROR', { error }));
    }
}

const debitPoints = async (options) => {
    try {
        const { userId,debit_amount,mobile_no,rechargeId,rechargeOid , availableArabianPoints , availableReachargePoints }=options;
        const rechargePoints = parseFloat(availableReachargePoints) - parseFloat(debit_amount);
        const points = parseFloat(availableArabianPoints);
        const option = {
            condition : { _id : stringToObjectId(userId) },
            data : {
                availableReachargePoints : rechargePoints
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
            end_balance             : availableArabianPoints,

            availableReachargePoints: availableReachargePoints,
            end_ReachargePoints     : rechargePoints,
            
            mobile_no               : mobile_no,
            record_type             : "Debit",
            narration               : 'Mobile Recharge',
            remarks                 : `${debit_amount} recharge to ${mobile_no}`,
            creation_ip             : ipAddress,
            created_at              : new Date(),
            created_by              : userId,
            status                  : "A"
        }
        const debitData    = await loadbalanceServices.createData(param);
        const updateOption = {
            condition : { _id : rechargeOid },
            data      : { $addToSet: { rechargeData: debitData._id } }
        }
        await rechargeServices.updateData(updateOption);

        return true;
    } catch (error) {
        console.log('error', error);
        return true;
    }
  }

const creditPoints = async (options) => {
try {
    const { userId,availableArabianPoints,availableReachargePoints,credit_amount,mobile_no,rechargeId,rechargeOid }=options;
    const points = parseFloat(availableReachargePoints) + parseFloat(credit_amount);
    const option = {
        condition : { _id : userId },
        data : {
            availableReachargePoints : points
        }
    }
    await userServices.updateData(option);
    

    const sequence  = await Counter.getSequence('kw_loadBalance');
    const ipAddress = await loginIP();
    // const total     = points + parseFloat(credit_amount);

    const param = {
        load_balance_id         : sequence.seq,
        rechargeId              : rechargeId,
        rechargeData            : rechargeOid,
        credit_user             : userId,
        points                  : credit_amount,
        availableArabianPoints  : availableArabianPoints,
        end_balance             : availableArabianPoints,
        availableReachargePoints: availableReachargePoints,
        end_ReachargePoints     : points,
        record_type             : "Credit",
        narration               : 'Mobile Recharge Commission',
        remarks                 : `${credit_amount?.toFixed()} recharge commission to ${mobile_no}`,
        creation_ip             : ipAddress,
        created_at              : new Date(),
        created_by              : userId,
        status                  : "A"
    }
    const creditData =  await loadbalanceServices.createData(param);
    // Adding crediting user_id
    const updateOption = {
        condition : { _id : rechargeOid },
        data      : { $addToSet: { rechargeData: creditData._id } }
    }

    await rechargeServices.updateData(updateOption);

    return true;
} catch (error) {
    return true;
}
}
/*********************************************************************************
 * Function Name    :   rechargeHistory
 * Purpose          :   This function is used to create recharge 
 * Created By       :   Afsar Ali
 * Created Data     :   03-01-2025
 * Updated By       :   
 * Update Data      :
 * Remarks          :
 **********************************************************************************/
exports.rechargeHistory = async function (req, res) {
    try {  
        const userId = req.user.userId;
        if(!isValidObjectId(userId)){
            return response.sendResponse(res, response.build('ERROR_VALIDATION', {}));
        }else{
            const { type='',select={},condition={},sort={}, page = 1 } = req.body;
            const limit = 10; 
            const skip = (page - 1) * limit; 
            const options = {
                type : type,
                ...(select?{select:select}:null),
                condition : { 
                    created_by : userId,
                    ...condition
                },
                sort : sort,
                skip : skip,
                limit : limit
            }
            const recharges = await rechargeServices.select(options);
            let result = {
                page : page,
                recharges : recharges,
                totalPage : 1
            }
            if(type === 'single' || type === 'count'){
                return response.sendResponse(res, response.build('SUCCESS', { result : result}));
            }else if(recharges.length > 0){
                const countOption = {
                    type : 'count',
                    condition : { 
                        created_by : userId,
                        ...condition
                    },
                }
                const totalCount = await rechargeServices.select(countOption);
                result.totalPage = Math.ceil(totalCount / 10);
                return response.sendResponse(res, response.build('SUCCESS', { result : result}));
            }else{
                return response.sendResponse(res, response.build('SUCCESS', { result : []}));
            }
        }
    } catch(error){
        return response.sendResponse(res, response.build('ERROR_SERVER_ERROR', { error }));
    }
}

/*********************************************************************************
 * Function Name    :   rechargeHistory
 * Purpose          :   This function is used to create recharge 
 * Created By       :   Afsar Ali
 * Created Data     :   07-01-2025
 * Updated By       :   
 * Update Data      :
 * Remarks          :
 **********************************************************************************/
exports.rechargeSummery = async function (req, res) {
    try {  
        const userId = req.user.userId;
        const { from_date, to_date }=req.body;
        // const today = new Date();
        // if(!from_date) {  from_date = `${today.getFullYear()}-${today.getMonth()+1}-${today.getDate() -1}`}
        // if(!to_date) {  to_date = `${today.getFullYear()}-${today.getMonth()+1}-${today.getDate()}`};
        if(!isValidObjectId(userId)){
            return response.sendResponse(res, response.build('ERROR_VALIDATION', {}));
        } else if(!from_date){
            return response.sendResponse(res, response.build('FROM_DATE_EMPTY', {}));
        } else if(!to_date){
            return response.sendResponse(res, response.build('TO_DATE_EMPTY', {}));
        } else {
            const options = {
                condition : { 
                    $or : [
                        {credit_user : userId},
                        {debit_user : userId},
                    ],
                    // created_by : userId,
                    // record_type : "Debit",
                    narration : {$in : ["Mobile Recharge", "Mobile Recharge Commission", "Mobile Recharge Commission Reverse","Mobile Recharge Failed"]},
                    // createdAt : { $gte : `${from_date} 21:31`, $lte : `${to_date} 21:30`},
                    createdAt : { $gte : from_date, $lte : to_date },
                    status : "A"
                 },
                 select : { points : true, narration : true }
            }
            const rechargeData = await loadbalanceServices.select(options);
            let result = {};
            result = rechargeData.reduce(
                (acc, item) => {
                    if(item.narration === "Mobile Recharge"){
                        acc.totalRecharge += parseFloat(item.points) || 0;
                    }else if(item.narration === "Mobile Recharge Failed"){
                        acc.totalRechargeFail += parseFloat(item.points) || 0;      
                    }else if(item.narration === "Mobile Recharge Commission"){
                        acc.totalCommission += parseFloat(item.points) || 0;      
                    }else if(item.narration === "Mobile Recharge Commission Reverse"){
                        acc.totalCommissionReverse += parseFloat(item.points) || 0; 
                    }
                    return acc;
                },
                { totalRecharge : 0, totalCommission : 0, totalRechargeFail : 0, totalCommissionReverse : 0,  }
            );
            result.totalRecharge = result?.totalRecharge - result?.totalRechargeFail
            result.totalCommission = result?.totalCommission - result?.totalCommissionReverse
            result.totalDue = result.totalRecharge - result.totalCommission;
            result.from_date = from_date;
            result.to_date = to_date;
            const rechargeOption = {
                condition : { 
                    created_by : userId,
                    ProcessingState : "Complete",
                    status : {$ne : "Failed"},
                    // createdAt : { $gte : `${from_date} 21:31`, $lte : `${to_date} 21:30`}
                    createdAt : { $gte : from_date, $lte : to_date },
                },
                select : { CommissionApplied : true, Price : true, ProviderCode : true, providerName : true, markUpValue : true, providerLogo:true },
                sort : { _id : -1}
            }
            const rechargeHistory = await rechargeServices.select_details(rechargeOption);
            let groupedData;
            
            if (rechargeHistory?.length > 0) {
                 groupedData = Object.values(
                    rechargeHistory.reduce((acc, item) => {
                        const { ProviderCode, providerName, providerLogo, CommissionApplied, Price, markUpValue, rechargeData } = item;
            
                        // Calculate total commission from rechargeData
                        const totalRechargeCommission = rechargeData?.reduce(
                            (sum, commissionItem) => sum + (parseFloat(commissionItem.points) || 0),
                            0
                        ) || 0; // Default to 0 if rechargeData is undefined or empty
            
                        if (!acc[ProviderCode]) {
                            acc[ProviderCode] = {
                                ProviderCode: ProviderCode || 'N/A',
                                providerName: providerName || 'N/A',
                                providerLogo: providerLogo || 'N/A',
                                totalCount: 0,
                                totalSales: 0,
                                totalCommission: 0, // Initialize to 0
                            };
                        }
            
                        // Update grouped data
                        acc[ProviderCode].totalCount += 1;
                        // acc[ProviderCode].totalSales += Price?.SendValue || 0; // Default to 0 if Price or SendValue is undefined
                        acc[ProviderCode].totalSales += markUpValue || 0; // Default to 0 if Price or SendValue is undefined
                        acc[ProviderCode].totalCommission += totalRechargeCommission + (CommissionApplied / 2 || 0);
            
                        return acc;
                    }, {})
                );
            
            }
            
            result.rechargeHistory = groupedData;
            return response.sendResponse(res, response.build('SUCCESS', { result}));
        }
    } catch(error){
        console.log('error',error);
        return response.sendResponse(res, response.build('ERROR_SERVER_ERROR', { error }));
    }
}