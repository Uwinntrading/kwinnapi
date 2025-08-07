const response = require("../../../../../../util/response");
const AdminServices = require("../../../../../services/admin/v1/AdminServices");
const crypto        = require('../../../../../../util/crypto');
const utility       = require('../../../../../../util/utility');
const constant      = require('../../../../../../config/constant');
const WhatsAppService = require('../../../../../../util/whatsApp_otp');
const messageService = require('../../../../../../util/messageService');
const emailTemplate = require('../../../../../../util/emailTemplate');
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
                    admin_first_name:true,
                    admin_country_code:true,
                    admin_phone : true ,
                    admin_email : true,
                    admin_password : true
                }
            }
            const result = await AdminServices.select(SelectWhere);
            if(result && result?.admin_email === email && result?.admin_password === hashedPassword){
                
                const randomOtp = utility.randomOtp();
                otp_sent = 'SMS'
                if(otp_sent === "SMS"){
                    await messageService.sendOTP({
                        senderId : `VENTX`,
                        phone: `${result?.admin_country_code}${result?.admin_phone}`,
                        message: `Your OTP code is: ${randomOtp}`
                    });
                    emailmessage = 'We received a request to verify your account. Use the OTP code below to proceed';
                    const template = await emailTemplate.otpTemplate({name:result?.admin_first_name,otp:randomOtp,message:emailmessage,header:'Your One-Time Password (OTP)'})
                    await messageService.sendEmail({email:result?.admin_email,subject:'Login verification Code',message:template});
                // } else if(otp_sent === "WhatsApp"){
                } else {
                    await WhatsAppService.sentOTP(result?.admin_phone);
                }
                const options = {
                    condition : { _id : result._id},
                    // data : { admin_password_otp : utility.randomOtp() }
                    data : { admin_password_otp : randomOtp }
                }

                
                const UpdatedResponse = await AdminServices.updateData(options);
                if(UpdatedResponse){
                    return response.sendResponse(res, response.build('VERIFY_OTP', {'user_id': result._id,'phone':result.admin_phone }));
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
        const { userId, otp} = req.body;
        
        // Build the query for AdminServices.select
        let selectWhere = {
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
        const result = await AdminServices.getAdminLogin(selectWhere);
        
        
        // Check if result is not empty and the first result has the correct _id
        if (result && result._id.toString() === userId.toString()) {
            
            const login_ip          = utility.loginIP(req);
            const currentTimestamp  = utility.currentTimestamp();
            
            // Update each found admin with new login details
            const options = {
                condition: { _id: result._id },
                data: { 
                    admin_password_otp : String('') , 
                    last_login_ip: login_ip,
                    update_ip: login_ip,
                    last_login_date: currentTimestamp,
                }
            };

           const responseData =  await AdminServices.updateData(options); // Update data in database
        //    const result2 = {
        //        admin_id         : responseData.admin_id,
        //        admin_first_name : responseData.admin_first_name,
        //        admin_type       : responseData.admin_type,
        //        token            : responseData.token,
        //        token            : responseData.token,
        //        token            : responseData.token,
        //        token            : responseData.token,
        //    }
           
            // Send the success response
            // console.log(responseData)
            return response.sendResponse(res, response.build('SUCCESS', { 'result' : responseData }));
        } else {
            // If user not found or OTP doesn't match, send error response
            const InvalidDetailsError = 'Invalid details';
            return response.sendResponse(res, response.build('ERROR_SERVER_ERROR', { result: InvalidDetailsError }));
        }
        
    } catch (error) {
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
        const { username , subject } = req.body;
        console.log(req.body);
        
        const isNumber = utility.isNumber(username);
        
        let SelectWhere = {
            type: 'single',
            condition : {
                ...(isNumber?{ admin_phone : username } : { admin_email : username }),
            },
            select : { 
                admin_first_name:true,
                admin_country_code:true,
                admin_email : true,
                admin_phone : true, 
                admin_id    : true
            }
        }

        // Execute the query to find the admin
        const result = await AdminServices.select(SelectWhere);

        // Check if result is not empty and the first result has the correct _id
        if (result && ( result.admin_email == username || result.admin_phone == username )) {
            const randomOtp = utility.randomOtp();
            const options = {
                condition : { _id : result._id},
                data : { admin_password_otp : randomOtp}
            }
            
            const UpdatedResponse = await AdminServices.updateData(options);
            otp_sent = 'SMS'
            if(otp_sent === "SMS"){
                await messageService.sendOTP({
                    senderId : `VENTX`,
                    phone: `${result?.admin_country_code}${result?.admin_phone}`,
                    message: `Your OTP code is: ${randomOtp}`
                });
                emailmessage = 'We received a request to verify your account. Use the OTP code below to proceed';
                const template = await emailTemplate.otpTemplate({name:result?.admin_first_name,otp:randomOtp,message:emailmessage,header:'Your One-Time Password (OTP)'})
                await messageService.sendEmail({email:result?.admin_email,subject,message:template});
            // } else if(otp_sent === "WhatsApp"){
            } else {
                await WhatsAppService.sentOTP(result?.admin_phone);
            }
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
               

            },
            select : { 
                admin_password_otp:true,
                admin_email : true,
                admin_phone : true, 
                admin_id    : true
            }
        }
        // Execute the query to find the admin
        const result = await AdminServices.select(SelectWhere);
     //   Check if result is not empty and the first result has the correct _id
        if(result && ( result.admin_email == username || result.admin_phone == username )){
            if (result. admin_password_otp == otp) {
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
                    return response.sendResponse(res, response.build('ERROR_VALIDATION', {  result : InvalidDetailsError   }));
                }
            } else {
                // If user not found or OTP doesn't match, send error response
                let errorMsg = 'Invalid OTP.';
                return response.sendResponse(res, response.build('ERROR_VALIDATION', { error: errorMsg }));
    
            }
        }else{
            let errorMsg = 'Invalid User.';
            return response.sendResponse(res, response.build('ERROR_VALIDATION', { error: errorMsg }));
        }
        
        
    } catch (error) {
        // Catch any errors and log them, then send an error response
        console.log('error', error);
        return response.sendResponse(res, response.build('ERROR_SERVER_ERROR', { error }));
    }
};

exports.getSampleData = async function(req, res) {
    const usrId = req.user.userId;
    const userType = req.user.userType;
    const phone = req.user.phone;

    return response.sendResponse(res, response.build('SUCCESS', { result : {usrId, userType, phone} }));
    
}

/*********************************************************************************
 * Function Name    : editProfile
 * Purposs          : This function is used to edit profile.
 * Created By       : Dilip Halder
 * Created Data     : 22 October 2024
 **********************************************************************************/
exports.editProfile = async function (req , res){
    try {  

        console.log(req.body)
        // Destructure the request body
        const {id , title, address, city, state, country , first_name , middle_name , last_name , email , country_code , mobile , password , confirm_password ,pincode , pin} = req.body;
        let hashedPassword ='';
        if(password && confirm_password){
            hashedPassword = crypto.encrypt(password, constant.crypto.secretKey, constant.crypto.iv );
        }
        const options = {
            condition : { 
                _id  : id ,
            },
            data :   {
                ...title          ? { admin_title  : title }        :'',
                ...address        ? { admin_address  : address }    :'',
                ...city           ? { admin_city  : city }          :'',
                ...state          ? { admin_state  : state }        :'',
                ...country        ? { admin_country  : country }    :'',
                ...first_name     ? { admin_first_name  : first_name }    :'',
                ...middle_name    ? { admin_middle_name : middle_name }   :'',
                ...last_name      ? { admin_last_name   : last_name }     :'',
                ...email          ? { admin_email       : email }         :'',
                ...country_code   ? { admin_country_code: country_code }  :'',
                ...mobile         ? { admin_phone       : mobile }        :'',
                ...password       ? { admin_password    : hashedPassword }:'',
                ...pincode        ? { admin_pincode     : pincode }:'',
                ...pin            ? { admin_pin         : pin }:'',
                }
        }

        const UpdatedResponse = await AdminServices.updateData(options);
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
}

/*********************************************************************************
 * Function Name    : editProfile
 * Purposs          : This function is used to edit profile.
 * Created By       : Dilip Halder
 * Created Data     : 22 October 2024
 **********************************************************************************/
exports.profileList = async function(req , res){
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

        const result = await AdminServices.select(listWhere);
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
        //End of Function
}