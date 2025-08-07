const generalData = require("../../../models/kw_general_data");

/**********************************************************************
 * Function Name    :   selectGeneralData
 * Purpose          :   This function is used for select from general data table
 * Created By       :   Afsar Ali
 * Created Data     :   28-05-2025
 * Updated By       :   
 * Update Data      :
 **********************************************************************/
exports.selectGeneralData = async function (options) {
    try {
      const { type, condition={}, select={}, sort={}, skip, limit } = options;
      if(type === 'count'){
        return await generalData.countDocuments(condition);
      } else if(type === 'single'){
        return await generalData.findOne(condition).select(select);
      } else {
        return await generalData.find(condition).select(select).sort(sort).skip(skip).limit(limit);
      }
    } catch (error) {
      return Promise.reject(error);
    }
}//End of Function


/**********************************************************************
 * Function Name    :   updateGeneralData
 * Purpose          :   This function is used for Update general table
 * Created By       :   Afsar Ali
 * Created Data     :   28-05-2025
 * Updated By       :   
 * Update Data      :
 **********************************************************************/
exports.updateGeneralData = async function (options) {
    try {
      const { condition={}, data={} } = options;
      return await generalData.findOneAndUpdate(condition, data, {new: true});
    } catch (error) {
      return Promise.reject(error);
    }
}//End of Function
