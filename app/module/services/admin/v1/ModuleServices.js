const Model = require('../../../../models/kw_admin_module');
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
        return await Model.countDocuments(condition).skip(skip).limit(limit);
      } else if(type === 'single'){
        return await Model.findOne(condition).select(select);
      } else {
        return await Model.find(condition).select(select).sort(sort).skip(skip).limit(limit);
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
      return await Model.insertMany(options);
  } catch (error) {
      return Promise.reject(error);
  }
};//End of Function

/**********************************************************************
 * Function Name    :   updateData
 * Purposs          :   This function is used for update Model
 * Created By       :   Dilip Halder
 * Created Data     :   15-October-2024
 **********************************************************************/
exports.updateData = async function (options) {
  try {
    const {condition, data} = options;
    return await Model.findByIdAndUpdate(condition, data, {new: true})
  } catch (error) {
    return Promise.reject(error);
  }
}//End of Function

/**********************************************************************
 * Function Name    :   updateData
 * Purposs          :   This function is used for update Model
 * Created By       :   Dilip Halder
 * Created Data     :   15-October-2024
 **********************************************************************/
exports.deleteData = async function (options) {
  try {
    return await Model.deleteMany(options)
  } catch (error) {
    return Promise.reject(error);
  }
}//End of Function

exports.getModelLogin = async function (options) {
  try {
    const { condition={} } = options;  
    const ModelData = await Model.findOne(condition);
    if(ModelData){
      if(ModelData.status === "I" || ModelData.status === "B" || ModelData.status === "D"){
        await userCache.invalidate(ModelData._id);
        return ModelData;
      }else{
        // generate auth token
        const token = await AuthToken.generateToken(
          ModelData._id,
          'Super Model',
          'SUPERModel',
          '365 days'
        );
        await userCache.invalidate(ModelData._id);
        await userCache.setToken(ModelData._id, token);
        await Model.findOneAndUpdate({_id:ModelData._id}, {token:token});
        return await Model.findById(ModelData._id);
      }
    }
  } catch (error) {
    return Promise.reject(error);
  }
}

exports.getDataById = async function (options) {
  try {
    const { condition={},select={} } = options;
    return await Model.findOne(condition).select(select);
  } catch (error) {
    return Promise.reject(error);
  }
}