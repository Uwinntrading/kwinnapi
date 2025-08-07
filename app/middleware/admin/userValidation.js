const response      = require('../../util/response');
const constant      = require('../../config/constant');
const utility       = require('../../util/utility');
const AdminServices = require('../../module/services/admin/v1/AdminServices');

exports.loggenInAuth = async function (req, res, next) {
    try {  
        // Destructure the request body
        const { username  } = req.body;
        const {key,logintoken, userid  } = req.headers;
        
        const isNumber = utility.isNumber(username);
        console.log('headder',req.headers)
        console.log(logintoken)
        
        
        if(key === constant.apikey){
            // Build the query for AdminServices.select
            let SelectWhere = {
                type : 'single',
                condition : {
                    admin_id : userid,
                    login_token : logintoken,
                },
                select : {
                    admin_phone     : true,
                    admin_email     : true,
                    admin_password  : true,
                    admin_id        : true 
                }
            }

            console.log(SelectWhere)
            
            // // Execute the query to find the admin
            const result = await AdminServices.select(SelectWhere);

            // Send the success response
            return response.sendResponse(res, response.build('SUCCESS', { result: result }));

            
        }
        
    } catch (error) {
        // Catch any errors and log them, then send an error response
        console.log('error', error);
        return response.sendResponse(res, response.build('ERROR_SERVER_ERROR', { error }));
    }
}



exports.validateAPI = async function (req, res, next) {
    const { key } = req.headers;
    if(key === constant.WEBAPIKEY){
        next();
    }else{
        return response.sendResponse(res, response.build("ERROR_TOKEN_REQUIRED", { error: 'Unauthorized Request' }) );
    }
}

/*********************************************************************************
 * Function Name    :   forgotPassword
 * Purposs          :   This function is validate forgot password.
 * Created By       :   Dilip Halder
 * Created Data     :   15 October 2024
 **********************************************************************************/
exports.forgotPassword = async function (req, res, next) {

    const { username ,otp , new_password , confirm_password  } = req.body;

    // Regular expressions to detect email and phone number
    let errorMsg = 'No';  // Set default error message

    if (utility.isNumber(username)) {  
        const isPhone = utility.isPhone(username);  
        if (!isPhone) {  // Corrected condition to simplify
            errorMsg = 'Please enter a valid mobile number';  
        }
    } else if (!utility.isEmail(username)) {  // Simplified email check
        errorMsg = 'Please enter a valid email';   
    } else if (otp === "" || otp === null ) {  // Checking OTP
        errorMsg = 'Please enter OTP.';   
    } else if (new_password == null || new_password.length < 8) {  // Password length check
        errorMsg = 'Please enter a valid password with at least 8 characters.';   
    } else if (new_password !== confirm_password) {  // Password match check
        errorMsg = 'Confirm password does not match.';   
    }

    if(errorMsg != '' && errorMsg !== "No"){
        console.log(errorMsg);
        return response.sendResponse(res, response.build('SUCCESS', { error: errorMsg }));
    }
    else if(errorMsg === "No"){
        next();
    }else{
        return response.sendResponse(res, response.build("ERROR_TOKEN_REQUIRED", { error: 'Unauthorized Request' }) );
    }

}


/*********************************************************************************
 * Function Name    :   editProfile
 * Purposs          :   This function is valiate editProfile.
 * Created By       :   Dilip Halder
 * Created Data     :   15 October 2024
 **********************************************************************************/
exports.editProfile = async function (req, res, next) {
    try {
        const { title ,first_name , middle_name ,last_name ,email ,country_code, mobile , password,confirm_password } = req.body;

        let errorMsg = 'No';  // Set default error message

        if (first_name && first_name?.length <2 ) {   
            errorMsg = 'First name at least 2 checracter long.';   
        } 
        else if (middle_name  &&  middle_name?.length < 2 ) {   
            errorMsg = 'Middle name at least 2 checracter long.';   
        } else if (last_name  && last_name?.length < 2 ) {   
            errorMsg = 'Last name at least 2 checracter long.'; 
        } else if (email && !utility.isEmail(email)) {  
            errorMsg = 'Please enter a valid email';   
        }
        else if (country_code && country_code?.length < 1 ) {  
            errorMsg = 'Please enter a Country Code';   
        } 
        else if (mobile && !utility.isPhone(parseInt(mobile))) {  
            errorMsg = 'Please enter a valid mobile number'; 
        } else if (password && password?.length < 8) {   
            errorMsg = 'Please enter a valid password with at least 8 characters.';   
        } else if (password && password !== confirm_password) {  
            errorMsg = 'Confirm password does not match.';   
        } 

        if(errorMsg != '' && errorMsg !== "No"){
            console.log(errorMsg);
            return response.sendResponse(res, response.build('SUCCESS', { error: errorMsg }));
        }
        else if(errorMsg === "No"){
            next();
        }else{
            return response.sendResponse(res, response.build("ERROR_TOKEN_REQUIRED", { error: 'Unauthorized Request' }) );
        }
    } catch (error) {
        console.log('error',error);
    }

}








