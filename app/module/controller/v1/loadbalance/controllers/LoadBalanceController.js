const counter          = require("../../../../../models/counter");
const response         = require("../../../../../util/response");
const utility          = require('../../../../../util/utility');
const counterService   = require('../../../../services/counterService');
const Services         = require("../../../../services/front/v1/loadbalanceServices");
 
/*********************************************************************************
 * Function Name    :   Add
 * Purposs          :   This function is used to add data
 * Created By       :   Dilip Halder
 * Created Data     :   23 October 2024
 **********************************************************************************/
exports.add = async function (req, res) {

    try {  
        const { 
            campaignOrderData ,campaignOrderNo ,credit_user ,debit_user ,points , 
            availableArabianPoints , end_balance , record_type ,narration, status, created_by ,created_user_id,
            availableReachargePoints ,end_ReachargePoints , remarks
         } = req.body;

        const counter = await counterService.getSequence('kw_loadBalance');
        const options = {
            load_balance_id  : counter.seq,  
            ...(campaignOrderData ? { campaignOrderData  : campaignOrderData } : ''),
            ...(campaignOrderNo   ? { campaignOrderNo    : campaignOrderNo } : ''),
            ...(credit_user       ? { credit_user  : credit_user } : ''),
            ...(debit_user        ? { debit_user : debit_user } : ''),
            ...(points            ? { points : points } : ''),
            ...(availableReachargePoints ? { availableReachargePoints : availableReachargePoints } : ''),
            ...(end_ReachargePoints      ? { end_ReachargePoints : end_ReachargePoints } : ''),
            ...(record_type       ? { record_type : record_type } : ''),
            ...(narration         ? { narration : narration } : ''),
            ...(remarks           ? { remarks : remarks } : ''),
            availableArabianPoints : availableArabianPoints || 0,
            end_balance : end_balance || 0,
            created_at          : new Date(),
            created_ip          : utility.loginIP(req),
            created_by          : created_by?created_by:utility.AdminUserID(req),
            status              : status?status:'A',
            created_user_id     : created_user_id?created_user_id:'',
        }
        const result =  await Services.createData(options);
        if(result){
            return response.sendResponse(res, response.build('SUCCESS', { result: result }));
        }
        
    } catch (error) {
        console.log(error)
        if (error.code === 11000) {
            return response.sendResponse(res, response.build('ERROR_DUPLICATE_DEPARTMENT', {
                error: 'Category name already exists',
                details: error.message
            }));
        }
        // Log any other errors and send a generic server error response
        // console.log('error', error);
        return response.sendResponse(res, response.build('ERROR_SERVER_ERROR', { error }));
    } 
};

/*********************************************************************************
 * Function Name    :   Update
 * Purposs          :   This function is used update data
 * Created By       :   Dilip Halder
 * Created Data     :   23 October 2024
 **********************************************************************************/
exports.update = async function (req, res) {
    try {  
        //  Destructure the request body
         const { campaignOrderData ,status} = req.body;

         const options = {
             condition : { 
                campaignOrderData:campaignOrderData
             },
             data : {
                 ...(status ? { status  : status } : ''),
                 updated_ip          : utility.loginIP(req),
                 updated_by          : utility.AdminUserID(req),
             }
         }

         const LoadBalanceResponce = await Services.updateManyData(options);
         if(LoadBalanceResponce){
             return response.sendResponse(res, response.build('SUCCESSFULLY_UPDATED',{ result :LoadBalanceResponce} ));
         }else{
             return response.sendResponse(res, response.build('ERROR_DATA_NOT_FOUND',{ result :[]} ));
 
         }
    } catch (error) {
        // Catch any errors and log them, then send an error response
        console.log('error', error);
        return response.sendResponse(res, response.build('ERROR_SERVER_ERROR', { error }));
    }
};
 
// /*********************************************************************************
//  * Function Name    :   delete
//  * Purposs          :   This function is used to delete data
//  * Created By       :   Dilip Halder
//  * Created Data     :   23 October 2024
//  **********************************************************************************/
// exports.delete = async function (req, res) {
//     try {
//         const { id } = req.body
//         console.log(req.body)

//         let SelectWhere = {
//             type : 'single',
//             condition : {
//                 _id : id,
//             },
//             select : {
//                 category_image : true ,
//             }
//         }
//         const result            = await Services.select(SelectWhere);
//         const oldCategoryImage  =  result.category_image;
//         if(oldCategoryImage){
//             await imageHandler.delete_img(oldCategoryImage)
//         }
//         const options      = { _id  : id }
//         const UpdatedResponse = await Services.deleteData(options);
//         if(UpdatedResponse){
//             return response.sendResponse(res, response.build('SUCCESSFULLY_DELETED',{ result :[]} ));
//         }
//     } catch (error) {
//         // Catch any errors and log them, then send an error response
//         return response.sendResponse(res, response.build('ERROR_SERVER_ERROR', { error }));
//     }
// } 


//  /*********************************************************************************
//  * Function Name  :  list
//  * Purposs        :  This function is used to add data
//  * Created By     :  Dilip Halder
//  * Created Data   :  21 January 2025
//  **********************************************************************************/
 exports.list = async function (req, res) {
    try {
        const { condition={}, select ={}, sort={}, type, skip, limit }=req.body;

        let listWhere = {
            ...(condition? {condition : { ...condition }}:null),
            ...(sort? {sort : sort}:null),
            ...(select? {select : select}:null),
            ...(type?{type:type}:null),
            ...(skip?{skip:skip}:null),
            ...(limit?{limit:limit}:{limit : 10}),

        }
        const result = await Services.select(listWhere);
        if(type == "count" && result == "" ){
            return response.sendResponse(res, response.build('SUCCESS',{ result : 0 } ));
        }else if(result != ''){
            return response.sendResponse(res, response.build('SUCCESS',{ result :result } ));
        }else{
            return response.sendResponse(res, response.build('ERROR_DATA_NOT_FOUND',{ result :[]} ));
        } 
        
    } catch (error) {
        console.log('error',error)
        return response.sendResponse(res, response.build('ERROR_SERVER_ERROR', { error }));
    }
}; //End of Function