const response         = require("../../../../../../util/response");
const Services         = require("../../../../../services/admin/v1/UserServices");
const counterService   = require('../../../../../services/counterService');
const utility          = require('../../../../../../util/utility');
const constant         = require('../../../../../../config/constant');


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
                users_type , users_seq_id , users_name , last_name , country_code , users_mobile , users_email , password , area , totalArabianPoints,availableArabianPoints
                ,term_condition , users_otp , is_verify ,status , referral_code, bind_person_id , bind_person_name, bind_user_type, pickup_point_holder, pos_device_id , pos_number,
                commission_percentage , store_name , token , created_at , created_ip ,created_by, created_from, app_version , app_name , latitude , longitude , device_id, device_type,summery_pin ,international_recharge_commission_percentage
          } = req.body;

        const counter = await counterService.getSequence('kw_users');
        const options = {
            users_id: counter.seq,
            users_type: users_type,
            users_seq_id: users_seq_id,
            users_name: users_name,
            last_name: last_name,
            country_code: country_code,
            users_mobile: users_mobile,
            users_email: users_email,
            password: password,
            area: area,
            totalArabianPoints: totalArabianPoints,
            availableArabianPoints: availableArabianPoints,
            term_condition: term_condition,
            users_otp: users_otp,
            is_verify: is_verify,
            status: status,  
            referral_code: referral_code,
            bind_person_id: bind_person_id,
            bind_person_name: bind_person_name,
            bind_user_type: bind_user_type,
            pickup_point_holder: pickup_point_holder,
            pos_device_id: pos_device_id,
            pos_number: pos_number,
            commission_percentage: commission_percentage,
            international_recharge_commission_percentage : international_recharge_commission_percentage ,
            store_name: store_name,
            token: token,
            created_from: created_from,
            app_version: app_version,
            app_name: app_name,
            latitude: latitude,
            longitude: longitude,
            device_id: device_id,
            summery_pin:summery_pin,
            device_type : device_type,
            created_ip  : utility.loginIP(req),
            created_by  : utility.AdminUserID(req)
        };
        

        const result =  await Services.create(options);
        if(result){
            return response.sendResponse(res, response.build('SUCCESS', { result: result }));
        } 
        // // Send the success response
    } catch (error) {
        if (error.code === 11000) {
            return response.sendResponse(res, response.build('ERROR_DUPLICATE_DEPARTMENT', {
                error: 'Department name already exists',
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
        const {
            users_type , users_seq_id , users_name , last_name , country_code , users_mobile , users_email , password , area , totalArabianPoints,availableArabianPoints
            ,term_condition , users_otp , is_verify , referral_code, bind_person_id , bind_person_name, bind_user_type, pickup_point_holder, pos_device_id , pos_number,
            commission_percentage , store_name , token , app_version , app_name , latitude , longitude , device_id, device_type  , buy_ticket , buy_voucher , company_name
            ,company_address , quick_user , id , status ,totalReachargePoints , availableReachargePoints ,redeeming_amount_limit , international_recharge_commission_percentage
        } = req.body;

        const options = {
            condition: {
                _id: id,
            },
            data: {
                ...(users_type ? { users_type: users_type } : ''),
                ...(users_seq_id ? { users_seq_id: users_seq_id } : ''),
                ...(users_name ? { users_name: users_name } : ''),
                ...(last_name ? { last_name: last_name } : ''),
                ...(country_code ? { country_code: country_code } : ''),
                ...(users_mobile ? { users_mobile: users_mobile } : ''),
                ...(users_email ? { users_email: users_email } : ''),
                ...(password ? { password: password } : ''),
                ...(area ? { area: area } : ''),
                ...(totalArabianPoints ? { totalArabianPoints: totalArabianPoints } : ''),
                ...(availableArabianPoints ? { availableArabianPoints: availableArabianPoints } : ''),
                ...(totalReachargePoints     ? { totalReachargePoints: totalReachargePoints } : ''),
                ...(availableReachargePoints ? { availableReachargePoints: availableReachargePoints } : ''),
                ...(redeeming_amount_limit   ? { redeeming_amount_limit: redeeming_amount_limit } : ''),
                ...(term_condition ? { term_condition: term_condition } : ''),
                ...(users_otp ? { users_otp: users_otp } : ''),
                ...(is_verify ? { is_verify: is_verify } : ''),
                ...(referral_code ? { referral_code: referral_code } : ''),
                ...(bind_person_id ? { bind_person_id: bind_person_id } : ''),
                ...(bind_person_name ? { bind_person_name: bind_person_name } : ''),
                ...(bind_user_type ? { bind_user_type: bind_user_type } : ''),
                ...(pickup_point_holder ? { pickup_point_holder: pickup_point_holder } : ''),
                // ...(pos_device_id ? { pos_device_id: pos_device_id } : ''),
                    pos_device_id :pos_device_id,
                ...(pos_number ? { pos_number: pos_number } : ''),
                ...(commission_percentage ? { commission_percentage: commission_percentage } : ''),
                ...(international_recharge_commission_percentage ? { international_recharge_commission_percentage: international_recharge_commission_percentage } : ''),
                ...(store_name ? { store_name: store_name } : ''),
                ...(token ? { token: token } : ''),
                ...(app_version ? { app_version: app_version } : ''),
                ...(app_name ? { app_name: app_name } : ''),
                ...(latitude ? { latitude: latitude } : ''),
                ...(longitude ? { longitude: longitude } : ''),
                ...(device_id ? { device_id: device_id } : ''),
                ...(device_type ? { device_type: device_type } : ''),
                ...(status ? { status: status } : ''),
                
                ...(buy_ticket      ? { buy_ticket: buy_ticket } : ''),
                ...(buy_voucher     ? { buy_voucher: buy_voucher } : ''),
                ...(company_name    ? { company_name: company_name } : ''),
                ...(company_address ? { company_address: company_address } : ''),
                ...(quick_user      ? { quick_user: quick_user } : ''),
                updated_ip: utility.loginIP(req),
                updated_by: utility.AdminUserID(req),
            },
        };

        const UpdatedResponse = await Services.updateData(options);
        if(UpdatedResponse){
            return response.sendResponse(res, response.build('SUCCESSFULLY_UPDATED',{ result :UpdatedResponse} ));
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

        const { id }          = req.body
        const options         = { _id  : id }
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
        console.log('listWhere : ', listWhere);
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
 
 