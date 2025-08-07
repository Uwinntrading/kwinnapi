const Users = require('../../../../models/kw_users');
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
        return await Users.countDocuments(condition);
      } else if(type === 'single'){
        return await Users.findOne(condition).select(select);
      } else {
        return await Users.find(condition).select(select).sort(sort).skip(skip).limit(limit);
      }
    } catch (error) {
      return Promise.reject(error);
    }
}//End of Function

/**********************************************************************
 * Function Name    :   updateData
 * Purposs          :   This function is used for update Users
 * Created By       :   Dilip Halder
 * Created Data     :   15-October-2024
 **********************************************************************/
exports.updateData = async function (options) {
  try {
    const {condition, data} = options;
    return await Users.findByIdAndUpdate(condition, data, {new: true})
  } catch (error) {
    return Promise.reject(error);
  }
}//End of Function

/**********************************************************************
 * Function Name    :   createDate
 * Purpose          :   This function is used for create new
 * Created By       :   Afsar Ali
 * Created Data     :   21-October-2024
 **********************************************************************/
exports.createDate = async function (options) {
  try {
    return await Users.create(options)
  } catch (error) {
    return Promise.reject(error);
  }
}//End of Function

/**********************************************************************
 * Function Name    :   updateData
 * Purposs          :   This function is used for update Users
 * Created By       :   Dilip Halder
 * Created Data     :   15-October-2024
 **********************************************************************/
exports.deleteData = async function (options) {
  try {
    return await Users.deleteMany(options)
  } catch (error) {
    return Promise.reject(error);
  }
}//End of Function

exports.getUserLogin = async function (options) {
  try {
    const { condition={} } = options;  
    const userData = await Users.findOne(condition);
    if(userData){
      if(userData.status === "I" || userData.status === "B" || userData.status === "D"){
        await userCache.invalidate(userData._id);
        return userData;
      }else{
        // generate auth token
        const token = await AuthToken.generateToken(
          userData._id,
          'Users',
          'Users',
          '365 days'
        );
        await userCache.invalidate(userData._id);
        await userCache.setToken(userData._id, token);
        await Users.findOneAndUpdate({_id:userData._id}, {token:token, users_otp: ''});
        return await Users.findById(userData._id);
      }
    }
  } catch (error) {
    return Promise.reject(error);
  }
}

exports.getDataById = async function (options) {
  try {
    const { condition={},select={} } = options;
    return await Users.findOne(condition).select(select);
  } catch (error) {
    return Promise.reject(error);
  }
}

exports.getUserById = async function (id) {
  try {
    return await Users.findById(id);
  } catch (error) {
    return Promise.reject(error);
  }
}