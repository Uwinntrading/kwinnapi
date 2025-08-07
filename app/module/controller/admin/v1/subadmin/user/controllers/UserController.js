const counter = require("../../../../../../../models/counter");
const response         = require("../../../../../../../util/response");
const utility          = require('../../../../../../../util/utility');
const Services         = require("../../../../../../services/admin/v1/subadmin/UserServices");
const crypto           = require('../../../../../../../util/crypto');
const constant         = require('../../../../../../../config/constant');
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
            admin_title , admin_first_name , admin_middle_name , admin_last_name , admin_email ,admin_country_code, admin_phone , admin_password , admin_password_otp , 
            admin_address , admin_city , admin_state , admin_pincode , department_id , department_name , designation_id , designation_name , admin_type
        } = req.body;

        // Validation start here
        const mobileWhere = {
             condition : { admin_phone : admin_phone },
             type      : 'single',
             limit     : 1 
        }
        const MobileCheck = await Services.select(mobileWhere);
        if(MobileCheck != '' &&  MobileCheck != null) { 
            let error = 'mobile number is already taken';
            return response.sendResponse(res, response.build('ERROR_SERVER_ERROR', { error }));
        }
        
        const EmailWhere = {
            condition : { admin_email : admin_email },
            type      : 'single',
            limit     : 1  
        }
        const EmailCheck = await Services.select(EmailWhere);
        if(EmailCheck != '' && EmailCheck != null ) { 
           let error = 'Email is already taken';
           return response.sendResponse(res, response.build('ERROR_SERVER_ERROR', { error }));
        }
        // Validation end here
        const hashedPassword = crypto.encrypt(admin_password, constant.crypto.secretKey, constant.crypto.iv );
        const counter = await counterService.getSequence('kw_admin')
        const options = {
            admin_id           : counter.seq,  
            admin_title        : admin_title,
            admin_first_name   : admin_first_name,
            admin_middle_name  : admin_middle_name,
            admin_last_name    : admin_last_name,
            admin_email        : admin_email,
            admin_country_code : admin_country_code,
            admin_phone        : admin_phone,
            admin_password     : hashedPassword,
            admin_password_otp : admin_password_otp,
            admin_address      : admin_address,
            admin_city         : admin_city,
            admin_state        : admin_state,
            admin_pincode      : admin_pincode,
            department_id      : department_id,
            department_name    : department_name,
            designation_id     : designation_id,
            designation_name   : designation_name,
            status             : "A",
            admin_type         : admin_type,
            created_ip         : utility.loginIP(req),
            created_by         : utility.AdminUserID(req)
        }
        const result =  await Services.create(options);
        if(result){
            return response.sendResponse(res, response.build('SUCCESS', { result: result }));
        } 
        // // Send the success response
    } catch (error) {
        if (error.code === 11000) {
            return response.sendResponse(res, response.build('ERROR_DUPLICATE_DEPARTMENT', {
                error: ' Already exists',
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
        const { } = req.body;

        const { 
            admin_title , admin_first_name , admin_middle_name='' , admin_last_name , admin_email ,admin_country_code, admin_phone , admin_password , admin_password_otp , 
            admin_address , admin_city , admin_state , admin_pincode , department_id , department_name , designation_id ,  admin_type , designation_name, designation_used 
            , id, status
        } = req.body;
        
        let hashedPassword = '';
        if(admin_password != null ){
             hashedPassword = crypto.encrypt(admin_password, constant.crypto.secretKey, constant.crypto.iv );
        }
        const options = {
            condition: {
                _id: id,
            },
            data: {
                ...(designation_name ? { designation_name: designation_name } : ''),
                ...(designation_name ? { designation_slug: utility.createSlug(designation_name) } : ''),
                ...(designation_used ? { designation_used: designation_used } : ''),
                ...(status ? { status: status } : ''),
        
                ...(admin_title ? { admin_title: admin_title } : ''),
                ...(admin_first_name ? { admin_first_name: admin_first_name } : ''),
                ...(admin_middle_name ? { admin_middle_name: admin_middle_name } : ''),
                ...(admin_last_name ? { admin_last_name: admin_last_name } : ''),
                ...(admin_email ? { admin_email: admin_email } : ''),
                ...(admin_country_code ? { admin_country_code: admin_country_code } : ''),
                ...(admin_phone ? { admin_phone: admin_phone } : ''),
                ...(admin_password ? { admin_password: hashedPassword } : ''),
                ...(admin_password_otp ? { admin_password_otp: admin_password_otp } : ''),
                ...(admin_address ? { admin_address: admin_address } : ''),
                ...(admin_city ? { admin_city: admin_city } : ''),
                ...(admin_state ? { admin_state: admin_state } : ''),
                ...(admin_pincode ? { admin_pincode: admin_pincode } : ''),
                ...(department_id ? { department_id: department_id } : ''),
                ...(department_name ? { department_name: department_name } : ''),
                ...(designation_id ? { designation_id: designation_id } : ''),
                ...(admin_type ? { admin_type: admin_type } : ''),
        
                updated_ip: utility.loginIP(req),
                updated_by: utility.AdminUserID(req),
            },
        };

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

        const { id } = req.body
        const options      = { _id  : id }
        const UpdatedResponse = await Services.deleteData(options);
        if(UpdatedResponse){
            return response.sendResponse(res, response.build('SUCCESSFULLY_DELETED',{ result :[]} ));
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