const Admin = require('../../../../models/kw_admin');
const AuthToken = require('../../../../util/authToken');
const userCache = require('../../../../util/userCache');
/**********************************************************************
 * Function Name    :   select
 * Purposs          :   This function is used to get user data by condition.
 * Created By       :   Dilip Halder
 * Created Data     :   15-October-2024
 **********************************************************************/
exports.select = async function (options) {
    try {
      const { type, condition, select, sort, skip, limit } = options;
      if(type === 'count'){
        // return await Services.find(condition).count();
        return await Admin.countDocuments(condition).skip(skip).limit(limit);
      } else if(type === 'single'){
        return await Admin.findOne(condition).select(select);
      } else {
        return await Admin.find(condition).select(select).sort(sort).skip(skip).limit(limit);
      }
    } catch (error) {
      return Promise.reject(error);
    }
}//End of Function

/**********************************************************************
 * Function Name    :   create
 * Purposs          :   This function is used for add Data
 * Created By       :   Dilip Halder
 * Created Data     :   22 October 2024
 **********************************************************************/
exports.create = async (options) => {
  try {
      return await Admin.insertMany(options);
  } catch (error) {
      return Promise.reject(error);
  }
};//End of Function

/**********************************************************************
 * Function Name    :   updateData
 * Purposs          :   This function is used for update Admin
 * Created By       :   Dilip Halder
 * Created Data     :   15-October-2024
 **********************************************************************/
exports.updateData = async function (options) {
  try {
    const {condition, data} = options;
    return await Admin.findByIdAndUpdate(condition, data, {new: true})
  } catch (error) {
    return Promise.reject(error);
  }
}//End of Function

/**********************************************************************
 * Function Name    :   updateData
 * Purposs          :   This function is used for update Admin
 * Created By       :   Dilip Halder
 * Created Data     :   15-October-2024
 **********************************************************************/
exports.deleteData = async function (options) {
  try {
    return await Admin.deleteMany(options)
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
          'Super Admin',
          'SUPERADMIN',
          '365 days'
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

exports.getDataById = async function (options) {
  try {
    const { condition={},select={} } = options;
    return await Admin.findOne(condition).select(select);
  } catch (error) {
    return Promise.reject(error);
  }
}