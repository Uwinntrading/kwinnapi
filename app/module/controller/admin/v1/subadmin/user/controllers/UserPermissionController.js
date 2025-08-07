const { json } = require("express");
const counter = require("../../../../../../../models/counter");
const response         = require("../../../../../../../util/response");
const utility          = require('../../../../../../../util/utility');
const Services         = require("../../../../../../services/admin/v1/subadmin/UserPermissionServices");
const counterService   = require('../../../../../../services/counterService');

/*********************************************************************************
 * Function Name    :   Add
 * Purposs          :   This function is used to add department
 * Created By       :   Dilip Halder
 * Created Data     :   21 October 2024
 **********************************************************************************/
exports.add = async function (req, res) {

    try {  
        
        // Destructure the request body
        const { 
            module_id ,module_name , module_display_name , module_orders , module_icone , admin_id , view_data , add_data , edit_data , delete_data , first_data
        } = req.body;
        
        const counter = await counterService.getSequence('kw_admin_permissions')
        const options = {
            seq_id              : counter.seq,
            module_id           : module_id,
            module_name         : module_name,
            module_display_name : module_display_name,
            module_orders       : module_orders,
            module_icone        : module_icone , 
            admin_id            : admin_id , 
            view_data           : view_data,
            add_data            : add_data,
            edit_data           : edit_data,
            delete_data         : delete_data,
            first_data          : JSON.parse(first_data),
            status              : "A",
            created_ip          : utility.loginIP(req),
            created_by          : utility.AdminUserID(req)
        }
        // console.log(options);
        
        const result =  await Services.create(options);
        if(result){
          return response.sendResponse(res, response.build('SUCCESS', { result: result }));
        } 

        // // Send the success response
    } catch (error) {
        if (error.code === 11000) {
            return response.sendResponse(res, response.build('ERROR_DUPLICATE_DEPARTMENT', {
                error: 'Already exists',
                details: error.message
            }));
        }
        // Log any other errors and send a generic server error response
        console.log('error', error);
        return response.sendResponse(res, response.build('ERROR_SERVER_ERROR', { error }));
    }
};
 
/*********************************************************************************
 * Function Name    :   UpdatePassword
 * Purposs          :   This function is used update data
 * Created By       :   Dilip Halder
 * Created Data     :   23 October 2024
 **********************************************************************************/
exports.update = async function (req, res) {
    try {  
        // Destructure the request body
        const { id , designation_name , designation_used , status } = req.body;
        const options = {
                condition : { 
                    _id  : id ,
                },
                data : {
                        ...(designation_name ? { designation_name  : designation_name }   : ''),
                        ...(designation_name ? { designation_slug  : utility.createSlug(designation_name) } : ''),
                        ...(designation_used ? { designation_used  : designation_used }   : ''),
                        ...(status          ? { status  : status }                        : ''),
                        updated_ip          : utility.loginIP(req),
                        updated_by          : utility.AdminUserID(req),                  
                }
        }

        const UpdatedResponse = await Services.updateData(options);
        if(UpdatedResponse){
            return response.sendResponse(res, response.build('SUCCESSFULLY_UPDATED',{ result : UpdatedResponse} ));
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

        const { admin_id } = req.body
        const options      = { admin_id  : admin_id }
        const UpdatedResponse = await Services.deleteData(options);

        if(UpdatedResponse){
            return response.sendResponse(res, response.build('SUCCESSFULLY_DELETED',{ result : UpdatedResponse } ));
        }

    } catch (error) {
        // Catch any errors and log them, then send an error response
        console.log('error', error);
        return response.sendResponse(res, response.build('ERROR_SERVER_ERROR', { error }));
    }
}

/*********************************************************************************
 * Function Name    :   list
 * Purposs          :   This function is used to add data
 * Created By       :   Dilip Halder
 * Created Data     :   23 October 2024
 **********************************************************************************/
exports.list = async function (req, res) {
    try {
        const { condition={}, select ={}, sort={}, type, skip, limit }=req.body;
        let listWhere = {
            ...(condition? {condition : { ...condition }}:null),
            ...(sort? {sort : sort}:null),
            ...(select? {select : select}:null),
            ...(type?{type:type}:null),
            // ...(skip?{skip:skip}:null),
            // ...(limit?{limit:limit}:{limit : 10}),
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