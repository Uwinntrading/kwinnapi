const response = require("../../../../../../util/response");
const encript = require("../../../../../../util/crypto");
const { isValidObjectId } = require("../../../../../../util/valueChecker");
const { upload_img } = require("../../../../../../util/imageHandler");
const Counter = require("../../../../../services/counterService");
const adminService = require("../../../../../services/crm/superAdminServices");
const admin_model = require("../../../../../services/crm/adminModel");
const userCache = require("../../../../../../util/userCache");
const emailServices = require('../../../../../services/emailServices');
const {getIpAddress} = require("../../../../../../util/utility");
const { createLogs } = require("../../../../../../util/logger");

/*********************************************************************************
 * Function Name    :   Login
 * Purpose          :   This function is used for Login Admin Dashboard
 * Created By       :   Afsar Ali
 * Created Data     :   06-MAY-2025
 * Updated By       :
 * Update Data      :
 * Remarks          :
 ********************************************************************************/
exports.login = async function (req, res) {
  try {
    const { email, password } = req.body;
    if (!email) {
      return response.sendResponse(res, response.build("EMAIL_EMPTY", {}));
    } else if (!password) {
      return response.sendResponse(res, response.build("PASSWORD_EMPTY", {}));
    } else {
      const where = {
        type: "single",
        condition: { status: "A", admin_email: email },
        select: {
          admin_email: true,
          admin_password: true,
          admin_first_name: true,
          admin_middle_name: true,
          admin_last_name: true,
        },
      };
      const userData = await adminService.select(where);
      if (userData) {
        const passCheck = await encript.checkMD5Password(
          password,
          userData.admin_password
        );
        let code = Math.floor(100000 + Math.random() * 900000);
        // const code = 654321;
        if (passCheck) {
          userData.admin_password = "";
          const updateOtp = {
            condition: { _id: userData._id },
            data: { admin_otp: code },
          };
          await adminService.updateData(updateOtp);
          emailServices.sentVerificationOTP({
            users_name: `${userData?.admin_first_name} ${userData?.admin_last_name}`,
            email: userData?.admin_email,
            otp: code,
          });
          const result = {
            email: userData.email,
            username: `${userData?.admin_first_name} ${userData?.admin_last_name}`,
            message:
              "Your One Time Password is sent to registered " + email + ".",
          };
          return response.sendResponse(
            res,
            response.build("SUCCESS", { result })
          );
        } else {
          return response.sendResponse(
            res,
            response.build("PASSWORD_ERROR", {})
          );
        }
      } else {
        return response.sendResponse(
          res,
          response.build("INVALID_LOGIN_CREDENTIAL", {})
        );
      }
    }
  } catch (error) {
    console.log(error);
    return response.sendResponse(
      res,
      response.build("ERROR_SERVER_ERROR", { error })
    );
  }
}; //End of Function

/*********************************************************************************
 * Function Name    :   verifyLoginOTP
 * Purpose          :   This function is used for verify login OTP
 * Created By       :   Afsar Ali
 * Created Data     :   06-MAY-2025
 * Updated By       :
 * Update Data      :
 * Remarks          :
 ********************************************************************************/
exports.verifyLoginOTP = async function (req, res) {
  try {
    const { email, otp } = req.body;
    if (!email) {
      return response.sendResponse(res, response.build("EMAIL_EMPTY", {}));
    } else if (!otp) {
      return response.sendResponse(res, response.build("PASSWORD_EMPTY", {}));
    } else {
      const where = {
        type: "single",
        condition: { status: "A", admin_email: email },
        select: { admin_email: true, admin_otp: true },
      };
      const userData = await adminService.select(where);
      if (userData) {
        if (userData.admin_otp === parseInt(otp)) {
          const ipAddress = await getIpAddress(req);
          const updateOtp = {
            condition: { _id: userData._id },
            data: { 
              admin_otp: "",
              last_login_ip : ipAddress || ":1",
              last_login_date : new Date()
            },
          };
          await adminService.updateData(updateOtp);
          const where = {
            condition: { _id: userData._id },
          };
          const result = await adminService.getAdminLogin(where);
          if (result) {
            createLogs(req, `${userData?.admin_email} login successfully.`,``);
            res.setHeader("authToken", result.token);
            result.admin_password = "";
            const options = {
              type : 'single',
              condition : {admin_id : result._id}
            }
            const permission = await adminService.selectPermission(options);
            return response.sendResponse(res, response.build('SUCCESS', {result, permission}));    
          } else{
              return response.sendResponse(res, response.build('SUCCESS', {result}));
          }
        } else {
          return response.sendResponse(res, response.build("INVALID_OTP", {}));
        }
      } else {
        return response.sendResponse(res, response.build("INVALID_OTP", {}));
      }
    }
  } catch (error) {
    console.log(error);
    return response.sendResponse(
      res,
      response.build("ERROR_SERVER_ERROR", { error })
    );
  }
}; //End of Function

/*********************************************************************************
 * Function Name    :   forgotPassword
 * Purpose          :   This function is used for forgot password
 * Created By       :   Afsar Ali
 * Created Data     :   08-JAN-2024
 * Updated By       :
 * Update Data      :
 * Remarks          :
 ********************************************************************************/
exports.forgotPassword = async function (req, res) {
  try {
    const { email } = req.body;
    if (!email) {
      return response.sendResponse(res, response.build("EMAIL_EMPTY", {}));
    } else {
      const where = {
        type: "single",
        condition: { status: "A", admin_email: email },
        select: {
          admin_email: true,
          admin_first_name: true,
          admin_middle_name: true,
          admin_last_name: true,
        },
      };
      const userData = await adminService.select(where);
      if (userData) {
        let code = Math.floor(100000 + Math.random() * 900000);
        // let code = 654321;
        
        const updateOtp = {
          condition: { _id: userData._id },
          data: { admin_otp: code },
        };
        await adminService.updateData(updateOtp);
        await emailServices.sentVerificationOTP({
          users_name: `${userData?.admin_first_name} ${userData?.admin_last_name}`,
          email: userData?.admin_email,
          otp: code,
        });
       
        const result = {
          email: userData.email,
          message:
            "Your One Time Password is sent to registered " + email + ".",
        };
        return response.sendResponse(
          res,
          response.build("SUCCESS", { result })
        );
      } else {
        return response.sendResponse(res, response.build("INVALID_EMAIL", {}));
      }
    }
  } catch (error) {
    console.log(error);
    return response.sendResponse(
      res,
      response.build("ERROR_SERVER_ERROR", { error })
    );
  }
}; //End of Function

/*********************************************************************************
 * Function Name    :   verifyLoginOTP
 * Purpose          :   This function is used for verify login OTP
 * Created By       :   Afsar Ali
 * Created Data     :   08-JAN-2024
 * Updated By       :
 * Update Data      :
 * Remarks          :
 ********************************************************************************/
exports.resetPassword = async function (req, res) {
  try {
    const { email, otp, password } = req.body;
    if (!email) {
      return response.sendResponse(res, response.build("EMAIL_EMPTY", {}));
    } else if (!password) {
      return response.sendResponse(res, response.build("PASSWORD_EMPTY", {}));
    } else if (!otp) {
      return response.sendResponse(res, response.build("OTP_EMPTY", {}));
    } else {
      const where = {
        type: "single",
        condition: { status: "A", admin_email: email },
        select: { admin_email: true, admin_otp: true },
      };
      const userData = await adminService.select(where);
      if (userData) {
        if (userData.admin_otp === parseInt(otp)) {
          const newPassword = await encript.createMD5Hash(password);
          const updateOtp = {
            condition: { _id: userData._id },
            data: { admin_otp: "", admin_password: newPassword },
          };
          const result = await adminService.updateData(updateOtp);
          if (result) {
            createLogs(req, `${userData?.admin_email} change password successfully.`,`ID : ${userData?._id}`);
            return response.sendResponse(res, response.build("SUCCESS", {}));
          } else {
            return response.sendResponse(
              res,
              response.build("SUCCESS", { result })
            );
          }
        } else {
          return response.sendResponse(res, response.build("INVALID_OTP", {}));
        }
      } else {
        return response.sendResponse(res, response.build("INVALID_OTP", {}));
      }
    }
  } catch (error) {
    console.log(error);
    return response.sendResponse(
      res,
      response.build("ERROR_SERVER_ERROR", { error })
    );
  }
}; //End of Function

/*********************************************************************************
 * Function Name    :   getAdminUsers
 * Purpose          :   This function is used for get admin users list
 * Created By       :   Afsar Ali
 * Created Data     :   23-JAN-2024
 * Updated By       :   
 * Update Data      :
 * Remarks          :
 ********************************************************************************/
exports.getSubAdminUsers = async function (req, res) {
  try {
      const usrId = req.user.userId;
      if(!isValidObjectId(usrId)){
          return response.sendResponse(res, response.build('PERMISSION_ERROR', { }));
      } else{
          const { condition={}, select ={}, limit, skip, sort={}, populate={}, type  } = req.body;
          let listWhere = {
              condition : {
                  ...condition,
                  admin_type : "Sub Admin"
              },
              ...(sort? {sort : sort}:null),
              ...(select? {select : select}:null),
              ...(limit?{limit : limit}: 10),
              ...(skip?{skip : skip}: 0),
              ...(populate?{populate : populate}:null),
              ...(type?{type:type}:null)
          }
          const result = await adminService.select(listWhere);

          if(result && type !== 'single'){
              const countOption = {
                  ...(condition? {condition : condition}:null),
                  type:'count'
              }
              const count = await adminService.select(countOption);
              return response.sendResponse(res, response.build('SUCCESS', { ...{count:count}, result }));
          } else {
              return response.sendResponse(res, response.build('SUCCESS', { ...{count:0}, result }));
          }
      }
  } catch (error) {
      console.log(error);
      return response.sendResponse(res, response.build('ERROR_SERVER_ERROR', { error }));
  }
}; //End of Function 

/*********************************************************************************
* Function Name    :   createSubAdminUser
* Purpose          :   This function is used for create sub admin
* Created By       :   Afsar Ali
* Created Data     :   23-JAN-2024
* Updated By       :   
* Update Data      :
* Remarks          :
********************************************************************************/
exports.createSubAdminUser = async function (req, res) {
  try {
      const usrId = req.user.userId;
      const email = req.user.email;
      const editId = req?.params?.editId;
      const { admin_first_name, admin_last_name, admin_email, admin_phone, department_name, permissions, ipAddress } = req.body;
      if(!isValidObjectId(usrId)){
          return response.sendResponse(res, response.build('PERMISSION_ERROR', { }));
      } else if(!ipAddress){
          return response.sendResponse(res, response.build('IPADDRESS_EMPTY', {}));
      } else{
          let params = {};
          params.admin_first_name     =   admin_first_name;
          params.admin_last_name      =   admin_last_name;
          params.admin_phone          =   admin_phone;
          params.department_name      =   department_name;
         
          if (editId !== ':editId') {
              if(!isValidObjectId(editId)){
                  return response.sendResponse(res, response.build('EDITID_ERROR', {}));
              }
              const isPermission = await admin_model.authCheck('edit_data',usrId);
              if(isPermission){
                  params.update_ip        = ipAddress;
                  params.update_date      = new Date(); 
                  params.update_by        = usrId;

                  params.admin_title      = 'Sub Admin';
                  params.admin_type       = 'Sub Admin';
                  const updateParam = {
                      condition : { _id : editId },
                      data :  params
                  }
                  const result = await adminService.updateData(updateParam);
                  createLogs(req, `${email} update sub-admin/permission.`,params);
                  if (result) {
                      const updatePermission = {
                          condition : { admin_id : editId },
                          data : permissions
                      }                        
                      await adminService.updateDataPermission(updatePermission);
                      return response.sendResponse(res, response.build('SUCCESS', {result : result}));
                  }else{
                      return response.sendResponse(res, response.build('ERROR_VALIDATION', {}));
                  }
              }else{
                  return response.sendResponse(res, response.build('PERMISSION_ERROR', {}));
              }
          } else {
              const isPermission = await admin_model.authCheck('add_data',usrId);
              if(isPermission){
                  const seqData = await Counter.getSequence('admins');
                  const password = await encript.createMD5Hash('Admin@123');
                  params.admin_title      = 'Sub Admin';
                  params.admin_type       = 'Sub Admin';
                  params.admin_id         = seqData?.seq;
                  params.admin_email      = admin_email;
                  
                  params.admin_password   = password;
                  params.creation_ip      = ipAddress;
                  params.creation_date    = new Date(); 
                  params.created_by       = usrId;
                  
                  const where = { 
                      condition:{ admin_email : admin_email},
                      type : "single" 
                  }
                  const adminUsr = await adminService.select(where);
                  if(!adminUsr){
                      const result = await adminService.createData(params);
                      createLogs(req, `${email} create sub-admin.`,params);
                      if(result){
                          result.password = "";
                          const permissionParams = {admin_id : result._id, ...permissions}
                          await adminService.createDataPermission(permissionParams);
                          return response.sendResponse(res, response.build('SUCCESS', {result : result}));
                      }else{
                          return response.sendResponse(res, response.build('ERROR_VALIDATION', {}));
                      }
                  }else{
                      return response.sendResponse(res, response.build('ERROR_ALREADY_EXIST', {}));
                  }
              }else{
                  return response.sendResponse(res, response.build('PERMISSION_ERROR', {}));
              }
          }
      }
  } catch (error) {
      console.log(error);
      return response.sendResponse(res, response.build('ERROR_SERVER_ERROR', { error }));
  }
}; //End of Function  

exports.logout = async function (req, res) {
  try {
    const usrId = req.user.userId;
    if (!isValidObjectId(usrId)) {
      return response.sendResponse(res, response.build("PERMISSION_ERROR", {}));
    } else {
      await userCache.invalidate(usrId);
      const updateUserOption = {
        condition: { _id: usrId },
        data: { token: "" },
      };
      const userData = await adminService.updateData(updateUserOption);
      createLogs(req, `${userData?.admin_email} logout successfully.`,`ID : ${userData?._id}`);
      return response.sendResponse(
        res,
        response.build("SUCCESS", {
          result: { message: "user successfully logout." },
        })
      );
    }
  } catch (error) {
    console.log(error);
    return response.sendResponse(
      res,
      response.build("ERROR_SERVER_ERROR", { error })
    );
  }
};

exports.testfuntion = async function (req, res) {
  // const key = encript.createMD5Hash(
  //   "Frisbee project developed by Algosoft under Afsar Ali Started on Feb-2024"
  // );
  // const dd = await notifications.sendWelcomeNotification('user');
    const result = await notifications.newOrderCreated('671cb73798b73a545aa56c8c');

  // console.log("key", dd);
  return response.sendResponse(res, response.build("SUCCESS", { result: result }));
};

/*********************************************************************************
 * Function Name    :   updateProfile
 * Purpose          :   This function is used for super admin updateProfile
 * Created By       :   Noor Alam
 * Created Data     :   15May-2024
 * Updated By       :
 * Update Data      :
 * Remarks          :
 ********************************************************************************/
exports.updateProfile = async function (req, res) {
  try {
    const userId = req.user.userId;
    const email = req.user.email;
    const {
      editId,
      admin_first_name,
      admin_last_name,
      admin_phone,
      admin_email,
      admin_address,
      admin_city,
      landmark,
      ipAddress,
    } = req.body;

    if (!admin_first_name) {
      return response.sendResponse(res, response.build("FIRSTNAME_EMPTY", {}));
    } else if (!admin_last_name) {
      return response.sendResponse(res, response.build("LASTNAME_EMPTY", {}));
    } else if (!admin_phone) {
      return response.sendResponse(res, response.build("PHONE_EMPTY", {}));
    } else if (!admin_email) {
      return response.sendResponse(res, response.build("EMAIL_EMPTY", {}));
    } else if (!admin_address) {
      return response.sendResponse(res, response.build("ADDRESS_EMPTY", {}));
    } else if (!admin_city) {
      return response.sendResponse(res, response.build("CITY_EMPTY", {}));
    } else {
      const params = {};
      if (req.file) {
        params.admin_image = await upload_img(req.file, "profile");
      }
      params.admin_first_name = admin_first_name;
      params.admin_last_name = admin_last_name;
      params.admin_address = admin_address;
      params.admin_city = admin_city;
      params.landmark = landmark;

      if (editId) {
        if (!isValidObjectId(editId)) {
          return response.sendResponse(res, response.build("EDITID_ERROR", {}));
        }
        const isPermission = await admin_model.authCheck("edit_data", userId);
        if (isPermission) {
          params.update_ip = ipAddress;
          params.update_date = new Date();
          params.update_by = userId;
          const updateParam = {
            condition: { _id: editId },
            data: params,
          };
          const result = await adminService.updateData(updateParam);
          createLogs(req, `${email} update admin.`,params);
          if (result) {
            return response.sendResponse(
              res,
              response.build("SUCCESS", { result })
            );
          } else {
            return response.sendResponse(
              res,
              response.build("ERROR_VALIDATION", {})
            );
          }
        } else {
          return response.sendResponse(
            res,
            response.build("PERMISSION_ERROR", {})
          );
        }
      } else {
        return response.sendResponse(res, response.build("EDITID_ERROR", {}));
      }
    }
  } catch (error) {
    console.log(error);
    return response.sendResponse(
      res,
      response.build("ERROR_SERVER_ERROR", { error })
    );
  }
}; //End of Function


/*********************************************************************************
 * Function Name    :   getPermission
 * Purpose          :   This function is used for get user permission 
 * Created By       :   Afsar Ali
 * Created Data     :   14-AUG-2024
 * Updated By       :   
 * Update Data      :
 * Remarks          :
 ********************************************************************************/
exports.getPermission = async function (req, res) {
  try {
      const userId = req.user.userId;
      const { admin_id } = req.body;
      if(!isValidObjectId(userId)){
          return response.sendResponse(res, response.build('PERMISSION_ERROR', { }));
      } else if(!isValidObjectId(admin_id)){
          return response.sendResponse(res, response.build('PERMISSION_ERROR', { }));
      } else {
          const options = {
              type : 'single',
              condition : {admin_id : admin_id}
          }
          const result = await adminService.selectPermission(options);
          if(result){
              return response.sendResponse(res, response.build('SUCCESS', { result }));
          }else{
              return response.sendResponse(res, response.build('SUCCESS', { result : {} }));
          }
      }
  } catch (error) {
      console.log(error);
      return response.sendResponse(res, response.build('ERROR_SERVER_ERROR', { error }));
  }
}; //End of Function 

/*********************************************************************************
* Function Name    :   changeStatus
* Purpose          :   This function is used for sub admin change status
* Created By       :   Afsar Ali
* Created Data     :   16-AUG-2024
* Updated By       :   
* Update Data      :
* Remarks          :
********************************************************************************/
exports.changeStatus = async function (req, res) {
  try {
    const usrId = req.user.userId;
    const { status, admin_id } =req.body;
    if (!isValidObjectId(usrId)) {
      return response.sendResponse(res, response.build("PERMISSION_ERROR", {}));
    } else {

      await userCache.invalidate(admin_id);
      const updateUserOption = {
        condition: { _id: admin_id },
        data: { status: status === 'A'? 'A':'I', token: "" },
      };
      await adminService.updateData(updateUserOption);
      createLogs(req, `${email} update admin account status.`,updateUserOption?.data);
      return response.sendResponse(
        res,
        response.build("SUCCESS", {
          result: { message: "Successfully uppdated." },
        })
      );
    }
  } catch (error) {
    console.log(error);
    return response.sendResponse(
      res,
      response.build("ERROR_SERVER_ERROR", { error })
    );
  }
};


/*********************************************************************************
* Function Name    :   sentOtp
* Purpose          :   This function is used for sub admin change status
* Created By       :   Afsar Ali
* Created Data     :   30-04-2025
* Updated By       :   
* Update Data      :
* Remarks          :
********************************************************************************/
exports.sentOtp = async function (req, res) {
  try {
    const usrId = req.user.userId;    
    const emailId = req.user.email;
    if (!isValidObjectId(usrId)) {
      return response.sendResponse(res, response.build("PERMISSION_ERROR", {}));
    } else {
      let code = Math.floor(100000 + Math.random() * 900000);
      if(emailId === 'afsar.ali@algosoft.co' || emailId === 'rashid.ali@algosoft.co'){
        code = 654321;
      }
      emailServices.sentVerificationOTP({
        users_name: `CRM User`,
        email: emailId,
        otp: code,
      });
      const updateUserOption = {
        condition: { _id: usrId, status : "A" },
        data: { admin_otp : 654321 }
      };
      await adminService.updateData(updateUserOption);
      return response.sendResponse(res, response.build("SUCCESS", {}));
    }
  } catch (error) {
    console.log(error);
    return response.sendResponse(res, response.build("ERROR_SERVER_ERROR", { error }));
  }
};

/*********************************************************************************
* Function Name    :   verifyOtp
* Purpose          :   This function is used for sub admin change status
* Created By       :   Afsar Ali
* Created Data     :   30-04-2025
* Updated By       :   
* Update Data      :
********************************************************************************/
exports.verifyOtp = async function (req, res) {
  try {
    const usrId = req.user.userId;    
    const {otp} = req.body;
    if (!isValidObjectId(usrId)) {
      return response.sendResponse(res, response.build("PERMISSION_ERROR", {}));
    } else if(!otp || otp?.length < 6){
      return response.sendResponse(res, response.build("OTP_ERROR", {}));
    }else {
      const userData = await adminService.getUserById(usrId);
      if(userData && userData?.status === 'A'){
        if(parseInt(otp) === userData?.admin_otp){
          const updateUserOption = {
            condition: { _id: usrId },
            data: { admin_otp: "" }
          };
          await adminService.updateData(updateUserOption);
          return response.sendResponse(res, response.build("SUCCESS", {}));
        } else{
          return response.sendResponse(res, response.build("INVALID_OTP", {}));
        }
      } else{
        return response.sendResponse(res, response.build("INVALID_OTP", {}));
      }
    }
  } catch (error) {
    console.log(error);
    return response.sendResponse(res, response.build("ERROR_SERVER_ERROR", { error }));
  }
};