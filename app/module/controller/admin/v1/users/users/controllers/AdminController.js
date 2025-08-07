const response = require("../../../../../../util/response");
const AdminServices = require("../../../../../services/admin/v1/AdminServices");
const crypto        = require('../../../../../../util/crypto');
const utility       = require('../../../../../../util/utility');
const constant      = require('../../../../../../config/constant');

 /*********************************************************************************
 * Function Name    :   Login
 * Purposs          :   This function is used to login for Admin 
 * Created By       :   Dilip Halder
 * Created Data     :   15 October 2024
 * Updated By       :   
 * Update Data      :
 * Remarks          :
 **********************************************************************************/
exports.login = async function (req, res) {

    try {  
        const { email,password, sort={}, type, skip, limit =1 }=req.body;
            const hashedPassword = crypto.encrypt(password, constant.crypto.secretKey, constant.crypto.iv );
            
            let SelectWhere = {
                type : 'single',
                condition : {
                    admin_email     : email,
                    admin_password  : hashedPassword,
                },
                select : {
                    admin_phone : true ,
                    admin_email : true,
                    admin_password : true
                }
            }
            // console.log('SelectWhere',SelectWhere);
            const result = await AdminServices.select(SelectWhere);
            
            if(result && result?.admin_email === email && result?.admin_password === hashedPassword){
                const randomOtp = Math.floor(1000 + Math.random() * 9000);  // Generates a random 4-digit number
               
                const options = {
                    condition : { _id : result._id},
                    data : { admin_password_otp : utility.randomOtp() }
                }
                
                const UpdatedResponse = await AdminServices.updateData(options);
                if(UpdatedResponse){
                    return response.sendResponse(res, response.build('VERIFY_OTP', {'user_id': result._id   }));
                }
                else{
                    const InvalidDetailsError = 'Invalid details';
                    return response.sendResponse(res, response.build('ERROR_SERVER_ERROR', {  result : InvalidDetailsError   }));
                }

            } else{
                const InvalidDetailsError = 'Invalid details';
                return response.sendResponse(res, response.build('ERROR_SERVER_ERROR', {  result : InvalidDetailsError   }));
            }
                 
        } catch (error) {
            console.log('error',error)
            return response.sendResponse(res, response.build('ERROR_SERVER_ERROR', { error }));
        }
}

 /*********************************************************************************
 * Function Name    :   verifyOtp
 * Purposs          :   This function is used to Verify OTP 
 * Created By       :   Dilip Halder
 * Created Data     :   15 October 2024
 * Updated By       :   
 * Update Data      :
 * Remarks          :
 **********************************************************************************/
exports.verifyOtp = async function (req, res) {

    try {  
        // Destructure the request body
        const { userId, otp, sort = {}, type, skip, limit = 1 } = req.body;
        
        // Build the query for AdminServices.select
        let SelectWhere = {
            type : 'single',
            condition : {
                _id : userId,
                admin_password_otp : otp
            },
            select : {
                admin_phone     : true,
                admin_email     : true,
                admin_password  : true,
                admin_id        : true 
            }
        }
        
        // Execute the query to find the admin
        const result = await AdminServices.select(SelectWhere);
        // console.log(result._id.toString())

        // Check if result is not empty and the first result has the correct _id
        if (result && result._id.toString() === userId.toString()) {
            const login_token = utility.generateRandomString();
            const login_ip = utility.loginIP(req);
            const currentTimestamp = utility.currentTimestamp();
            
            // Update each found admin with new login details
            const options = {
                condition: { _id: result._id },
                data: { 
                    admin_password_otp : String('') , 
                    login_token,
                    last_login_ip: login_ip,
                    update_ip: login_ip,
                    last_login_date: currentTimestamp,
                    update_date: currentTimestamp
                }
            };

            await AdminServices.updateData(options); // Update data in database

            // Extract admin_id from the result
            let admin_id = result.admin_id;

            // Build the success response
            const responseData = {
                'login_token': login_token,
                'admin_id': admin_id
            };

            // Send the success response
            return response.sendResponse(res, response.build('SUCCESS', { result: responseData }));
        } else {
            // If user not found or OTP doesn't match, send error response
            const InvalidDetailsError = 'Invalid details';
            return response.sendResponse(res, response.build('ERROR_SERVER_ERROR', { result: InvalidDetailsError }));
        }
        
    } catch (error) {
        // Catch any errors and log them, then send an error response
        console.log('error', error);
        return response.sendResponse(res, response.build('ERROR_SERVER_ERROR', { error }));
    }
};

 /*********************************************************************************
 * Function Name    :   sendOTOP
 * Purposs          :   This function is used to send OTP OTP 
 * Created By       :   Dilip Halder
 * Created Data     :   15 October 2024
 * Updated By       :   
 * Update Data      :
 * Remarks          :
 **********************************************************************************/
exports.sendOTP = async function (req, res) {
    try {  
        // Destructure the request body
        const { username } = req.body;
        const isNumber = utility.isNumber(username);
        
        let SelectWhere = {
            type: 'single',
            condition : {
                ...(isNumber?{ admin_phone : username } : { admin_email : username }),
            },
            select : { 
                admin_email : true,
                admin_phone : true, 
                admin_id    : true
            }
        }

        // Execute the query to find the admin
        const result = await AdminServices.select(SelectWhere);

        // Check if result is not empty and the first result has the correct _id
        if (result && ( result.admin_email == username || result.admin_phone == username )) {
            
            const options = {
                condition : { _id : result._id},
                data : { admin_password_otp : utility.randomOtp() }
            }
            
            const UpdatedResponse = await AdminServices.updateData(options);
            if(UpdatedResponse){
                return response.sendResponse(res, response.build('VERIFY_OTP',{ result :[]} ));
            }
            else{
                const InvalidDetailsError = 'Invalid details';
                return response.sendResponse(res, response.build('ERROR_SERVER_ERROR', {  result : InvalidDetailsError   }));
            }
            

        } else {
            // If user not found or OTP doesn't match, send error response
            const InvalidDetailsError = 'Invalid details';
            return response.sendResponse(res, response.build('ERROR_SERVER_ERROR', { result: InvalidDetailsError }));
        }
        
    } catch (error) {
        // Catch any errors and log them, then send an error response
        console.log('error', error);
        return response.sendResponse(res, response.build('ERROR_SERVER_ERROR', { error }));
    }
};

/*********************************************************************************
 * Function Name    :   UpdatePassword
 * Purposs          :   This function is used to send OTP OTP 
 * Created By       :   Dilip Halder
 * Created Data     :   15 October 2024
 * Updated By       :   
 * Update Data      :
 * Remarks          :
 **********************************************************************************/
 exports.UpdatePassword = async function (req, res) {
    try {  
        // Destructure the request body
        const { username ,otp , new_password , confirm_password  } = req.body;
        const isNumber = utility.isNumber(username);
        
        let SelectWhere = {
            type: 'single',
            condition : {
                ...(isNumber?{ admin_phone : username } : { admin_email : username }),
                admin_password_otp : otp,

            },
            select : { 
                admin_email : true,
                admin_phone : true, 
                admin_id    : true
            }
        }

        // Execute the query to find the admin
        const result = await AdminServices.select(SelectWhere);
     //   Check if result is not empty and the first result has the correct _id
        if (result && ( result.admin_email == username || result.admin_phone == username )) {
            const hashedPassword = crypto.encrypt(new_password, constant.crypto.secretKey, constant.crypto.iv );
            const options = {
                condition : { 
                    _id  : result._id ,
                    admin_password_otp  :otp,
                    ...(isNumber?{ admin_phone : username } : { admin_email : username }),
                },
                data : { 
                    admin_password : hashedPassword,
                    admin_password_otp : "",
                    login_token : "",
                 }
            }
            // console.log(options);
            
            const UpdatedResponse = await AdminServices.updateData(options);
            if(UpdatedResponse){
                return response.sendResponse(res, response.build('PASSWORD_UPDATED',{ result :[]} ));
            }
            else{
                const InvalidDetailsError = 'Invalid details';
                return response.sendResponse(res, response.build('ERROR_SERVER_ERROR', {  result : InvalidDetailsError   }));
            }
        } else {
            // If user not found or OTP doesn't match, send error response
            let errorMsg = 'Invalid OTP.';
            return response.sendResponse(res, response.build('SUCCESS', { error: errorMsg }));

        }
        
    } catch (error) {
        // Catch any errors and log them, then send an error response
        console.log('error', error);
        return response.sendResponse(res, response.build('ERROR_SERVER_ERROR', { error }));
    }
};