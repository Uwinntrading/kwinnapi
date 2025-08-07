const response = require("../../../../../../util/response");
const crypto        = require('../../../../../../util/crypto');
const utility       = require('../../../../../../util/utility');
const {isValidObjectId, capitalizeEachWord} = require('../../../../../../util/valueChecker');
const constant      = require('../../../../../../config/constant');
const userService   = require('../../../../../services/front/v1/userServices');
const counter       = require('../../../../../services/counterService');
const userCache     = require('../../../../../../util/userCache');
const WhatsAppService = require('../../../../../../util/whatsApp_otp');
const messageService = require('../../../../../../util/messageService');

/*********************************************************************************
 * Function Name    :   Login
 * Purpose          :   This function is used to login for Admin 
 * Created By       :   Afsar Ali
 * Created Data     :   21 October 2024
 * Updated By       :   
 * Update Data      :
 * Remarks          :
 **********************************************************************************/
exports.signup = async function (req, res) {
    try {  
        const { users_name, last_name, users_email, country_code, users_mobile, users_password, device_id, app_name, app_version, device_type, created_by }=req.body;
        const seq_count = await counter.getSequence('kw_users', 'Users');
        const usr_pass = crypto.createMD5Hash(users_password);
        const options = {
            type : 'count',
            condition : {
                $or : [
                    {users_mobile : users_mobile},
                    {users_email : users_email}
                ]
            }
        }
        const isAvailable = await userService.select(options);
        if(isAvailable !== 0){
            return response.sendResponse(res, response.build('USERS_ALREADY_EXIST', { result : [{error : "Phone/Email already registered."}]}));
        } else{

            const randomOTP  = utility.randomOtp();
            const params = {
                users_id        : seq_count.seq,
                users_seq_id    : seq_count.seq_id,
                users_name      : users_name,
                last_name       : last_name,
                users_type      : "Users",
                country_code    : country_code,
                users_mobile    : users_mobile,
                password        : usr_pass,
                ...(users_email?{users_email : users_email}:null),
                ...(app_name?{app_name : app_name}:null),
                ...(device_id?{device_id : device_id}:null),
                ...(app_version?{app_version : app_version}:null),
                ...(device_type?{device_type : device_type}:null),
                users_otp       : randomOTP,
                is_verify       : "N",
                status          : 'A',
                created_at      : new Date(),
                created_by      : created_by?created_by:'Self'
            }

            
            if(country_code != "" && users_mobile  != ""){
                const dd =  await messageService.sendOTP({
                    senderId : `VENTX`,
                    phone: `${country_code}${users_mobile}`,
                    message: `Your OTP code is: ${randomOTP}`
                });
                

                return response.sendResponse(res, response.build('SUCCESS', { result : dd }));
            }

            const result = await userService.createDate(params);
            if(result){

                if(country_code != "" && users_mobile  != ""){
                    await messageService.sendOTP({
                        senderId : `VENTX`,
                        phone: `${country_code}${users_mobile}`,
                        message: `Your OTP code is: ${randomOTP}`
                    });
                }




                return response.sendResponse(res, response.build('SUCCESS', { result : result}));
            } else{
                return response.sendResponse(res, response.build('SUCCESS', { result : []}));
            }

            
        }
    } catch(error){
        return response.sendResponse(res, response.build('ERROR_SERVER_ERROR', { error }));
    }
}

/*********************************************************************************
 * Function Name    :   Login
 * Purpose          :   This function is used to login for Admin 
 * Created By       :   Afsar Ali
 * Created Data     :   21 October 2024
 * Updated By       :   
 * Update Data      :
 * Remarks          :
 **********************************************************************************/
exports.login = async function (req, res) {

    try {  
        const { email, phone, country_code, password, pos_device_id, device_id, app_name, app_version, device_type, otp_sent }=req.body;
        if(!email && !phone && !country_code && !pos_device_id){
            return response.sendResponse(res, response.build('CREDENTIAL_ERROR', { }));
        } else if(!password){
            return response.sendResponse(res, response.build('PASSWORD_EMPTY', { }));
        } else{
            const hashedPassword = crypto.createMD5Hash(password);
            let selectWhere = {
                type : 'single',
                condition : {
                    ...(email?{users_email     : email}:{
                        country_code : country_code,
                        users_mobile : parseInt(phone)
                    }),
                    password : hashedPassword,
                    status : "A"
                },
                select : {
                    users_mobile : true ,
                    users_email : true,
                    password : true,
                    pos_device_id : true
                }
            }
            const result = await userService.select(selectWhere);
            if(result && result?.password === hashedPassword){
                const phone_number = `${country_code}${phone}`;
                if(!result?.pos_device_id){
                    const randomOTP = utility.randomOtp();
                    if(otp_sent === "SMS"){
                        await messageService.sendOTP({
                            senderId : `VENTX`,
                            phone: `${country_code}${phone}`,
                            message: `Your OTP code is: ${randomOTP}`
                        });
                    // } else if(otp_sent === "WhatsApp"){
                    } else {
                        await WhatsAppService.sentOTP(phone_number);
                    }

                    const updateParam = {
                        condition : { _id : result._id },
                        data : { 
                            app_version   : app_version, 
                            pos_device_id : pos_device_id, 
                            device_type : device_type, 
                            otp_sent : otp_sent, 
                            ...(otp_sent === "SMS" && {users_otp : randomOTP } ) }
                    }
                    await userService.updateData(updateParam);
                    return response.sendResponse(res, response.build('VERIFY_OTP', {result : [] }));
                    // if(otpResp.status === true){
                    // } else{
                    //     const InvalidDetailsError = 'Invalid details';
                    //     return response.sendResponse(res, response.build('CREDENTIAL_ERROR', {  result : InvalidDetailsError   }));
                    // }
                } else if(result?.pos_device_id && result?.pos_device_id === pos_device_id){
                    const randomOTP = utility.randomOtp();
                    if(otp_sent === "SMS"){
                        await messageService.sendOTP({
                            senderId : `VENTX`,
                            phone: `${country_code}${phone}`,
                            message: `Your OTP code is: ${randomOTP}`
                        });
                    // } else if(otp_sent === "WhatsApp"){
                    } else {
                        await WhatsAppService.sentOTP(phone_number);
                    }

                    const updateParam = {
                        condition : { _id : result._id },
                        data : { 
                            // pos_device_id : pos_device_id, 
                            app_version : app_version, 
                            device_type : device_type, 
                            otp_sent : otp_sent, 
                            ...(otp_sent === "SMS" && {users_otp : randomOTP } ) }
                    }
                    await userService.updateData(updateParam);
                    // const otpResp = await WhatsAppService.sentOTP(phone_number);
                    return response.sendResponse(res, response.build('VERIFY_OTP', {result : [] }));
                    // if(otpResp.status === true){
                    // } else{
                    //     const InvalidDetailsError = 'Invalid details';
                    //     return response.sendResponse(res, response.build('CREDENTIAL_ERROR', {  result : InvalidDetailsError   }));
                    // }
                } else{
                    return response.sendResponse(res, response.build('DEVICE_NOT_MATCH', { }));
                }
            } else{
                const InvalidDetailsError = 'Invalid details';
                return response.sendResponse(res, response.build('CREDENTIAL_ERROR', {  result : InvalidDetailsError   }));
            }
        }    
    } catch (error) {
        console.log('error',error)
        return response.sendResponse(res, response.build('ERROR_SERVER_ERROR', { error }));
    }
}

 /*********************************************************************************
 * Function Name    :   verifyOtp
 * Purpose          :   This function is used to Verify OTP 
 * Created By       :   Afsar Ali
 * Created Data     :   22 October 2024
 * Updated By       :   
 * Update Data      :
 * Remarks          :
 **********************************************************************************/
exports.verifyOtp = async function (req, res) {
    try {  
        const { email, phone, country_code, otp} = req.body;
        if(!email && !phone && !country_code){
            return response.sendResponse(res, response.build('CREDENTIAL_ERROR', { }));
        } else if(!otp){
            return response.sendResponse(res, response.build('OTP_EMPTY', { }));
        } else{
            let options = {
                type : "single",
                condition : {
                    ...(email?{users_email : email}:{
                        country_code : country_code,
                        users_mobile : parseInt(phone)
                    }),
                }
            }
            const userData = await userService.select(options);
            if(userData){
                let isVerify = false;
                if(userData && userData?.otp_sent === "SMS" && userData?.users_otp == otp){
                    isVerify = true;
                } else if(userData && userData?.otp_sent === "WhatsApp"){
                    const otpResp = await WhatsAppService.verifyOTP(`${country_code}${phone}`,otp);
                    if(otpResp.status === true){ isVerify = true; }
                } 
                else {
                    isVerify = false; 
                }
                if(isVerify === true){
                    let selectWhere = {
                        condition : {
                            ...(email?{users_email : email}:{
                                country_code : country_code,
                                users_mobile : parseInt(phone)
                            }),
                        }
                    }
                    const userData = await userService.getUserLogin(selectWhere);
                    if (userData && userData.status === 'A') {
                        // res.setHeader("authToken",userData.token);
                        return response.sendResponse(res, response.build('SUCCESS', { result : userData }));
                    } else {
                        return response.sendResponse(res, response.build('OTP_WRONG', { result: 'Please enter correct OTP.' }));
                    }
                }else{
                    return response.sendResponse(res, response.build('OTP_WRONG', {}));
                }
            } else{
                return response.sendResponse(res, response.build('OTP_WRONG', {}));
            }
        }
    } catch (error) {
        console.log('error', error);
        return response.sendResponse(res, response.build('ERROR_SERVER_ERROR', { error }));
    }
};

/*********************************************************************************
 * Function Name    :   resetPassword
 * Purpose          :   This function is used to reset password 
 * Created By       :   Afsar Ali
 * Created Data     :   23 October 2024
 * Updated By       :   
 * Update Data      :
 * Remarks          :
 **********************************************************************************/
exports.forgotPassword = async function (req, res) {
    try {  
        const { email, phone, country_code, otp_sent} = req.body;
        if(!email && !phone && !country_code){
            return response.sendResponse(res, response.build('LOGIN_USER_EMPTY', { }));
        } else{
            let selectWhere = {
                type : 'single',
                condition : {
                    ...(email?{users_email : email}:{
                        country_code : country_code,
                        users_mobile : parseInt(phone)
                    }),
                    status : "A"
                },
                select :{
                    users_email : true,
                    users_mobile : true,
                    country_code : true,
                    status : true
                }
            }
            const userData = await userService.select(selectWhere);
            if (userData && userData.status === 'A') {
                const phone_number = `${country_code}${phone}`;
                const randomOTP = utility.randomOtp();
                if(otp_sent === "WhatsApp"){
                    await WhatsAppService.sentOTP(phone_number);
                } else if(otp_sent === "SMS"){
                    await messageService.sendOTP({
                        senderId : `VENTX`,
                        phone: `${country_code}${phone}`,
                        message: `Your OTP code is: ${randomOTP}`
                    });
                }
                const updateParam = {
                    condition : { _id : userData._id },
                    data : { 
                        otp_sent : otp_sent, 
                        ...(otp_sent === "SMS" && {users_otp : randomOTP } ) }
                }
                await userService.updateData(updateParam);

                // const otpResp = await WhatsAppService.sentOTP(phone_number);
                // const options = {
                //     condition : { _id : userData._id},
                //     data : { users_otp : 4321 }
                // }
                // const UpdatedResponse = await userService.updateData(options);

                return response.sendResponse(res, response.build('VERIFY_OTP', { result : [] }));
            } else {
                const InvalidDetailsError = 'User not found.';
                return response.sendResponse(res, response.build('LOGIN_USER_EMPTY', { result: InvalidDetailsError }));
            }
        }
    } catch (error) {
        console.log('error', error);
        return response.sendResponse(res, response.build('ERROR_SERVER_ERROR', { error }));
    }
};

/*********************************************************************************
 * Function Name    :   resetPassword
 * Purpose          :   This function is used to reset password 
 * Created By       :   Afsar Ali
 * Created Data     :   23 October 2024
 * Updated By       :   
 * Update Data      :
 * Remarks          :
 **********************************************************************************/
exports.resetPassword = async function (req, res) {
    try {  
        const { email, phone, country_code, password, otp} = req.body;
        if(!email && !phone && !country_code){
            return response.sendResponse(res, response.build('LOGIN_USER_EMPTY', { }));
        } else if(!password){
            return response.sendResponse(res, response.build('PASSWORD_EMPTY', { }));
        } else if(!otp){
            return response.sendResponse(res, response.build('OTP_EMPTY', { }));
        } else{
            let isVerify = false;

            let selectWhere = {
                type : 'single',
                condition : {
                    ...(email?{users_email : email}:{
                        country_code : country_code,
                        users_mobile : parseInt(phone)
                    }),
                    status : "A"
                },
                select :{
                    users_email : true,
                    users_mobile : true,
                    country_code : true,
                    status : true,
                    users_otp : true,
                    otp_sent : true
                }
            }
            const userData = await userService.select(selectWhere);
            console.log('userData',userData);
            if(userData && userData?.otp_sent === "SMS" && userData?.users_otp === otp ){
                isVerify = true;
            } else if(userData && userData.otp_sent === "WhatsApp"){
                const otpResp = await WhatsAppService.verifyOTP(`${country_code}${phone}`,otp);
                console.log('otpResp',otpResp);
                if(otpResp.status === true){ isVerify = true; }

            } else{ 
                isVerify = false
            }   
            console.log('isVerify : ',isVerify);
            if(isVerify === true){
                const hashedPassword = crypto.createMD5Hash(password);
                
                if (userData && userData.status === 'A') {
                    const ipAddress = await utility.loginIP();
                    const options = {
                        condition : { _id : userData._id},
                        data : { 
                            users_otp   : '',
                            password    : hashedPassword,
                            token       : '',
                            updated_at  : new Date(),
                            updated_ip  : ipAddress?ipAddress:':1',
                            updated_by  : userData?._id
                        }
                    }
                    const UpdatedResponse = await userService.updateData(options);
                    userCache.invalidate(userData._id);
                    return response.sendResponse(res, response.build('SUCCESS', { result : {} }));
                } else {
                    const InvalidDetailsError = 'User not found.';
                    return response.sendResponse(res, response.build('OTP_WRONG', { result: InvalidDetailsError }));
                }
            } else{
                return response.sendResponse(res, response.build('OTP_WRONG', {  }));
            }
        }
    } catch (error) {
        console.log('error', error);
        return response.sendResponse(res, response.build('ERROR_SERVER_ERROR', { error }));
    }
};

/*********************************************************************************
 * Function Name    :   logout
 * Purpose          :   This function is used to logout
 * Created By       :   Afsar Ali
 * Created Data     :   23 October 2024
 * Updated By       :   
 * Update Data      :
 * Remarks          :
 **********************************************************************************/
exports.logout = async function (req, res) {
    try {  
        const userId = req.user.userId;
        if(!isValidObjectId(userId)){
            return response.sendResponse(res, response.build('LOGIN_USER_EMPTY', { }));
        } else{
            const ipAddress = await utility.loginIP();
            const options = {
                condition : { _id : userId},
                data : { 
                    users_otp   : '',
                    token       : '',
                    updated_at  : new Date(),
                    updated_ip  : ipAddress?ipAddress:':1',
                    updated_by  : userId
                }
            }
            const UpdatedResponse = await userService.updateData(options);
            userCache.invalidate(userId);
            return response.sendResponse(res, response.build('SUCCESS', { result : {} }));
        }
    } catch (error) {
        console.log('error', error);
        return response.sendResponse(res, response.build('ERROR_SERVER_ERROR', { error }));
    }
};

/*********************************************************************************
 * Function Name    :   resetPassword
 * Purpose          :   This function is used to reset password 
 * Created By       :   Afsar Ali
 * Created Data     :   23 October 2024
 * Updated By       :   
 * Update Data      :
 * Remarks          :
 **********************************************************************************/
exports.getUserData = async function (req, res) {
    try {  
        const userId = req.user.userId;
        if(!isValidObjectId(userId)){
            return response.sendResponse(res, response.build('UNAUTHORIZED', { }));
        } else{
            let selectWhere = {
                type : 'single',
                condition : {
                    _id : userId,
                    status : "A"
                },
                select :{
                    token       : false,
                    users_otp   : false,
                    password    : false,
                    created_at  : false,
                    created_by  : false,
                    createdAt   : false,
                    updatedAt   : false,
                    __v         : false,
                    updated_at  : false,
                    updated_by  : false,
                    updated_ip  : false
                }
            }
            const userData = await userService.select(selectWhere);
            return response.sendResponse(res, response.build('SUCCESS', { result : userData }));
        }
    } catch (error) {
        console.log('error', error);
        return response.sendResponse(res, response.build('ERROR_SERVER_ERROR', { error }));
    }
};

/*********************************************************************************
 * Function Name    :   resetPassword
 * Purpose          :   This function is used to reset password 
 * Created By       :   Afsar Ali
 * Created Data     :   23 October 2024
 * Updated By       :   
 * Update Data      :
 * Remarks          :
 **********************************************************************************/
exports.editUser = async function (req, res) {
    try {  
        const userId = req.user.userId;
        let currentEmail = req.user.email;
        const { users_name, last_name, users_email } = req.body;
        if(!isValidObjectId(userId)){
            return response.sendResponse(res, response.build('UNAUTHORIZED', { }));
        } else{
            const ipAddress = await utility.loginIP();
            if(users_email && currentEmail !== users_email){
                const options = {
                    type : 'count',
                    condition : { users_email : users_email }
                }
                const isEmailUsed = await userService.select(options);
                if(isEmailUsed === 0){
                    currentEmail = users_email;
                }
            } 

            const params = {
                ...(users_name?{users_name : await capitalizeEachWord(users_name)}:null),
                ...(last_name?{last_name : await capitalizeEachWord(last_name)}:null),
                ...(currentEmail?{users_email : currentEmail}:''),

                updated_at  : new Date(),
                updated_ip  : ipAddress?ipAddress:':1',
                updated_by  : userId
            }
            const updateOption = {
                condition : { _id : userId },
                data : params
            }
            const isUpdate = await userService.updateData(updateOption);
            if(isUpdate){
                let selectWhere = {
                    type : 'single',
                    condition : {
                        _id : userId,
                        status : "A"
                    },
                    select :{
                        token       : false,
                        users_otp   : false,
                        password    : false,
                        created_at  : false,
                        created_by  : false,
                        createdAt   : false,
                        updatedAt   : false,
                        __v         : false,
                        updated_at  : false,
                        updated_by  : false,
                        updated_ip  : false
                    }
                }
                const result = await userService.select(selectWhere);
                return response.sendResponse(res, response.build('SUCCESS', { result }));
            }
        }
    } catch (error) {
        console.log('error', error);
        return response.sendResponse(res, response.build('ERROR_SERVER_ERROR', { error }));
    }
};

/*********************************************************************************
 * Function Name    :   sentOtp
 * Purpose          :   This function is used to verify summery pin 
 * Created By       :   Afsar Ali
 * Created Data     :   06-122024
 * Updated By       :   
 * Update Data      :
 * Remarks          :
 **********************************************************************************/
exports.sentOtp = async function (req, res) {
    try {  
        const userId = req.user.userId;
        const { otp_sent } = req.body;
        if(!isValidObjectId(userId)){
            return response.sendResponse(res, response.build('UNAUTHORIZED', { }));
        } else{
            let isOTPSent = false;
            const options = {
                type : 'single',
                condition : { _id : userId },
                select : { country_code : true, users_mobile : true, status: true, summery_pin : true, users_otp : true }
            }
            const userData = await userService.select(options);
           
            if(userData && userData.status === 'A'){
                const phone_number = `${userData.country_code}${userData.users_mobile}`;
                const randomOTP = utility.randomOtp();
                
                if(otp_sent === "SMS"){
                    await messageService.sendOTP({
                        senderId : `VENTX`,
                        phone: phone_number,
                        message: `Your OTP code is: ${randomOTP}`
                    });
                    isOTPSent = true;
                } else {
                    console.log(phone_number);

                    const otpResp = await WhatsAppService.sentOTP(phone_number);
                    if(otpResp.status === true){ isOTPSent = true; }
                }

                if(isOTPSent === true){
                    const updateParam = {
                        condition : { _id : userData._id },
                        data : { 
                            otp_sent : otp_sent, 
                            ...(otp_sent === "SMS" && {users_otp : randomOTP } ) }
                    }
                    await userService.updateData(updateParam);
                    return response.sendResponse(res, response.build('SUCCESS', { }));
                } else {
                    return response.sendResponse(res, response.build('OTP_ERROR', { }));
                }
            } else {
                return response.sendResponse(res, response.build('ERROR_DATA_NOT_FOUND', { }));
            }
        }
    } catch (error) {
        console.log('error', error);
        return response.sendResponse(res, response.build('ERROR_SERVER_ERROR', { error }));
    }
};


/*********************************************************************************
 * Function Name    :   updateSummeryPin
 * Purpose          :   This function is used to update summery pin 
 * Created By       :   Afsar Ali
 * Created Data     :   06-122024
 * Updated By       :   
 * Update Data      :
 * Remarks          :
 **********************************************************************************/
exports.updateSummeryPin = async function (req, res) {
    try {  
        const userId = req.user.userId;
        const { otp, summery_pin , otp_sent } = req.body;
        if(!isValidObjectId(userId)){
            return response.sendResponse(res, response.build('UNAUTHORIZED', { }));
        } else if(!otp){
            return response.sendResponse(res, response.build('OTP_EMPTY', { }));
        } else if(!summery_pin){
            return response.sendResponse(res, response.build('PIN_ERROR', { }));
        } else{
            const options = {
                type : 'single',
                condition : { _id : userId },
                select : { country_code : true, users_mobile : true, status: true , users_otp: true }
            }
            const userData = await userService.select(options);
            if(userData && userData.status === 'A'){
                const ipAddress = await utility.loginIP();
                const phone_number = `${userData.country_code}${userData.users_mobile}`

                let otpResp = { status: false }; // Initialize otpResp as an object with default status
                if (otp_sent === "SMS") {
                    if (userData.users_otp === otp) {
                        otpResp.status = true;
                    }
                } else {
                    otpResp = await WhatsAppService.verifyOTP(phone_number, otp);
                }
               
                if(otpResp.status === true){
                    const updateOption = {
                        condition : {  _id : userId },
                        data : { 
                            users_otp   : '',
                            summery_pin : summery_pin,
                            updated_ip : ipAddress?ipAddress:':1',
                            updated_at : new Date(),
                         }
                    }
                    await userService.updateData(updateOption);
                    return response.sendResponse(res, response.build('SUCCESS', { }));
                } else {
                    return response.sendResponse(res, response.build('OTP_WRONG', { }));
                }
            } else {
                return response.sendResponse(res, response.build('ERROR_DATA_NOT_FOUND', { }));
            }
        }
    } catch (error) {
        console.log('error', error);
        return response.sendResponse(res, response.build('ERROR_SERVER_ERROR', { error }));
    }
};


/*********************************************************************************
 * Function Name    :   verifySummeryPin
 * Purpose          :   This function is used to verify summery pin 
 * Created By       :   Afsar Ali
 * Created Data     :   06-122024
 * Updated By       :   
 * Update Data      :
 * Remarks          :
 **********************************************************************************/
exports.verifySummeryPin = async function (req, res) {
    try {  
        const userId = req.user.userId;
        const { pin } = req.body;
        if(!isValidObjectId(userId)){
            return response.sendResponse(res, response.build('UNAUTHORIZED', { }));
        } else if(!pin){
            return response.sendResponse(res, response.build('PIN_ERROR', { }));
        } else{
            const options = {
                type : 'single',
                condition : { _id : userId },
                select : { country_code : true, users_mobile : true, status: true, summery_pin : true }
            }
            const userData = await userService.select(options);
            if(userData && userData.status === 'A'){
                if(userData.summery_pin === parseInt(pin)){
                    return response.sendResponse(res, response.build('SUCCESS', { }));
                } else {
                    return response.sendResponse(res, response.build('PIN_ERROR', { }));
                }
            } else {
                return response.sendResponse(res, response.build('ERROR_DATA_NOT_FOUND', { }));
            }
        }
    } catch (error) {
        console.log('error', error);
        return response.sendResponse(res, response.build('ERROR_SERVER_ERROR', { error }));
    }
};
