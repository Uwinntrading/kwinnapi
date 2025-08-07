const AuthToken       = require('../../../../../util/authToken');
const userCache       = require('../../../../../util/userCache');
const CollectionTable = require('../../../../../models/kw_admin');
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
        return await CollectionTable.countDocuments(condition);
      } else if(type === 'single'){
        return await CollectionTable.findOne(condition).select(select);
      } else {
        return await CollectionTable.find(condition).select(select).sort(sort).skip(skip).limit(limit);
      }
    } catch (error) {
      return Promise.reject(error);
    }
}//End of Function

/**********************************************************************
 * Function Name    :   create
 * Purposs          :   This function is used for create order archive
 * Created By       :   Dilip Halder
 * Created Data     :   21-OCTOBER-2024
 **********************************************************************/
exports.create = async (options) => {
    try {
        return await CollectionTable.insertMany(options);
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
    return await CollectionTable.findByIdAndUpdate(condition, data, {new: true})
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
    return await CollectionTable.deleteMany(options)
  } catch (error) {
    return Promise.reject(error);
  }
}//End of Function