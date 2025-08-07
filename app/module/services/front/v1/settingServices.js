const settingModal = require('../../../../models/kw_settings');

/**********************************************************************
 * Function Name    :   select
 * Purpose          :   This function is used to get user data by condition.
 * Created By       :   Afsar Ali
 * Created Data     :   10-12-2024
 **********************************************************************/
exports.select = async function (options) {
    try {
      const { type, condition, select, sort, skip, limit } = options;
      if(type === 'count'){
        return await settingModal.countDocuments(condition);
      } else if(type === 'single'){
        return await settingModal.findOne(condition).select(select);
      } else {
        return await settingModal.find(condition).select(select).sort(sort).skip(skip).limit(limit);
      }
    } catch (error) {
      return Promise.reject(error);
    }
}//End of Function

/**********************************************************************
 * Function Name    :   selectWithPopulate
 * Purpose          :   This function is used to get user data by condition.
 * Created By       :   Afsar Ali
 * Created Data     :   10-12-2024
 **********************************************************************/
exports.getDataById = async function (id) {
  try {
    return settingModal.findById(id);
  } catch (error) {
    return Promise.reject(error);
  }
}//End of Function