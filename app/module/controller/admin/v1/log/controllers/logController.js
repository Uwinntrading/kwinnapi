const counter = require("../../../../../../models/counter");
const response         = require("../../../../../../util/response");
const counterService   = require('../../../../../services/counterService');
const logService       = require("../../../../../services/admin/v1/log/logServices");
 
 /*********************************************************************************
 * Function Name    :   Add
 * Purposs          :   This function is used to add data
 * Created By       :   Dilip Halder
 * Created Data     :   23 October 2024
 **********************************************************************************/
exports.add = async function (req, res) {
    try {  
        
        const { admin_id , admin_token , login_status , login_datetime , login_ip } = req.body;
         
        const counter = await counterService.getSequence('kw_admin_login_log');
        const options = {
            login_log_id    : counter.seq,  
            admin_id        : admin_id,  
            admin_token     : admin_token,  
            login_status    : login_status,  
            login_datetime  : login_datetime,  
            login_ip        : login_ip
        }

        const result =  await logService.create(options);
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
         const { id ,status } = req.body;
         const options = {
             condition : { 
                 _id  : id ,
             },
             data : {
                 ...(status ? { status  : status } : ''),
                 updated_ip          : utility.loginIP(req),
                 updated_by          : utility.AdminUserID(req),
             }
         }
         const OrderResponce = await logService.updateData(options);
         
        //  return response.sendResponse(res, response.build('SUCCESSFULLY_UPDATED',{ result :OrderResponce} ));
         let UpdatedResponse = {};
         if(OrderResponce != ''){
            const options1 = {
                condition : { 
                    order_id  : id ,
                },
                data : {
                    ...(status ? { status  : status } : ''),
                    updated_ip          : utility.loginIP(req),
                    updated_by          : utility.AdminUserID(req),
                }
            }
            UpdatedResponse = await logService12.updateManyData(options1);
         }

         if(UpdatedResponse){
             return response.sendResponse(res, response.build('SUCCESSFULLY_UPDATED',{ result :OrderResponce} ));
         }else{
             return response.sendResponse(res, response.build('ERROR_DATA_NOT_FOUND',{ result :[]} ));
 
         }
    } catch (error) {
        // Catch any errors and log them, then send an error response
        console.log('error', error);
        return response.sendResponse(res, response.build('ERROR_SERVER_ERROR', { error }));
    }
};
 
/*********************************************************************************
 * Function Name    :   delete
 * Purposs          :   This function is used to delete data
 * Created By       :   Dilip Halder
 * Created Data     :   23 October 2024
 **********************************************************************************/
exports.delete = async function (req, res) {
    try {
        const { id } = req.body
        console.log(req.body)

        let SelectWhere = {
            type : 'single',
            condition : {
                _id : id,
            },
            select : {
                category_image : true ,
            }
        }
        const result            = await logService.select(SelectWhere);
        const oldCategoryImage  =  result.category_image;
        if(oldCategoryImage){
            await imageHandler.delete_img(oldCategoryImage)
        }
        const options      = { _id  : id }
        const UpdatedResponse = await logService.deleteData(options);
        if(UpdatedResponse){
            return response.sendResponse(res, response.build('SUCCESSFULLY_DELETED',{ result :[]} ));
        }
    } catch (error) {
        // Catch any errors and log them, then send an error response
        return response.sendResponse(res, response.build('ERROR_SERVER_ERROR', { error }));
    }
} 


 /*********************************************************************************
 * Function Name  :  list
 * Purposs        :  This function is used to add data
 * Created By     :  Dilip Halder
 * Created Data   :  21 January 2025
 **********************************************************************************/
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
        const result = await logService1.select_details(listWhere);
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
    