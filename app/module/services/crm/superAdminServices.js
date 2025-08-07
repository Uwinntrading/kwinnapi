const Admin = require('../../../models/admin');
const Permission = require('../../../models/admin_permissions');
const AuthToken = require('../../../util/authToken');
const userCache = require('../../../util/userCache');
const { 
  authTokenSuperAdminAuthExpiresIn
 } = require('../../../config/constant');
/**********************************************************************
 * Function Name    :   select
 * Purpose          :   This function is used for select from admin user table
 * Created By       :   Afsar Ali
 * Created Data     :   06-JAN-2024
 * Updated By       :   
 * Update Data      :
 * Remarks          : 
 **********************************************************************/
exports.select = async function (options) {
    try {
      const { type, condition={}, select={}, sort={}, skip, limit, populate={} } = options;
      if(type === 'count'){
        return await Admin.find(condition).count();
      } else if(type === 'single'){
        return await Admin.findOne(condition).select(select);
      } else {
        return await Admin.find(condition).sort(sort).skip(skip).limit(limit);
      }
    } catch (error) {
      return Promise.reject(error);
    }
}//End of Function

/**********************************************************************
 * Function Name    :   createData
 * Purpose          :   This function is used for Update admin user table
 * Created By       :   Afsar Ali
 * Created Data     :   23-JAN-2024
 * Updated By       :   
 * Update Data      :
 * Remarks          : 
 **********************************************************************/
exports.createData = async function (params) {
  try {
    return await Admin.create(params);
  } catch (error) {
    return Promise.reject(error);
  }
}//End of Function

/**********************************************************************
 * Function Name    :   updateData
 * Purpose          :   This function is used for Update admin user table
 * Created By       :   AFsar Ali
 * Created Data     :   06-JAN-2024
 * Updated By       :   
 * Update Data      :
 * Remarks          : 
 **********************************************************************/
exports.updateData = async function (options) {
    try {
      const { condition={}, data={} } = options;
      return await Admin.findOneAndUpdate(condition, data, {new: true});
    } catch (error) {
      return Promise.reject(error);
    }
}//End of Function

exports.getAdminLogin = async function (options) {
  try {
    const { condition={} } = options;  
    const adminData = await Admin.findOne(condition);
    if(adminData){
      if(adminData.status === "I" || adminData.status === "B" || adminData.status === "D"){
        await userCache.invalidate(adminData._id);
        return adminData;
      }else{
        // generate auth token
        const token = await AuthToken.generateToken(
          adminData._id,
          "CRM_ADMIN",
          "CRM_ADMIN",
          authTokenSuperAdminAuthExpiresIn
        );
        await userCache.invalidate(adminData._id);
        await userCache.setToken(adminData._id, token);
        await Admin.findOneAndUpdate({_id:adminData._id}, {token:token});
        return await Admin.findById(adminData._id);
      }
    }
  } catch (error) {
    return Promise.reject(error);
  }
}

exports.getUserById = async function (id) {
  try {
    return await Admin.findById(id);
  } catch (error) {
    return Promise.reject(error);
  }
}

/******************** Permisson ****************** */
/**********************************************************************
 * Function Name    :   selectPermission
 * Purpose          :   This function is used for select from admin permission table
 * Created By       :   AFsar Ali
 * Created Data     :   14-AUG-2024
 * Updated By       :   
 * Update Data      :
 * Remarks          : 
 **********************************************************************/
exports.selectPermission = async function (options) {
  try {
    const { type, condition={}, select={}, sort={}, skip, limit, populate={} } = options;
    if(type === 'count'){
      return await Permission.find(condition).count();
    } else if(type === 'single'){
      return await Permission.findOne(condition).select(select);
    } else {
      return await Permission.find(condition).sort(sort).skip(skip).limit(limit);
    }
  } catch (error) {
    return Promise.reject(error);
  }
}//End of Function

/**********************************************************************
* Function Name    :   createDataPermission
* Purpose          :   This function is used for create admin permission 
* Created By       :   Afsar Ali
* Created Data     :   14-AUG-2024
* Updated By       :   
* Update Data      :
* Remarks          : 
**********************************************************************/
exports.createDataPermission = async function (params) {
try {
  return await Permission.create(params);
} catch (error) {
  return Promise.reject(error);
}
}//End of Function

/**********************************************************************
* Function Name    :   updateDataPermission
* Purpose          :   This function is used for Update admin permission table
* Created By       :   Afsar Ali
* Created Data     :   14-AUG-2024
* Updated By       :   
* Update Data      :
* Remarks          : 
**********************************************************************/
exports.updateDataPermission = async function (options) {
  try {
    const { condition={}, data={} } = options;
    return await Permission.findOneAndUpdate(condition, data, {new: true});
  } catch (error) {
    return Promise.reject(error);
  }
}//End of Function
