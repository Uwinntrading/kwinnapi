const Winners = require('../../../../models/uw_uwin_winner_archives');
/**********************************************************************
 * Function Name    :   select
 * Purposs          :   This function is used for select from vendorservices table
 * Created By       :   Afsar Ali
 * Created Data     :   19-MARCH-2024
 * Updated By       :   
 * Update Data      :
 * Remarks          : 
 **********************************************************************/
exports.select = async function (options) {
    try {
      const { type, condition={}, select={}, sort={}, skip, limit } = options;
      if(type === 'count'){
        return await Winners.countDocuments(condition);
      } else if(type === 'single'){
        return await Winners.findOne(condition).select(select);
      } else {
        return await Winners.find(condition).select(select).sort(sort).skip(skip).limit(limit);
      }
    } catch (error) {
      return Promise.reject(error);
    }
}//End of Function

/**********************************************************************
 * Function Name    :   create
 * Purposs          :   This function is used for create order archive
 * Created By       :   Afsar Ali
 * Created Data     :   10-SEPT-2024
 * Updated By       :   
 * Update Data      :
 * Remarks          : 
 **********************************************************************/
exports.create = async (options) => {
  try {
      return await Winners.insertMany(options);
  } catch (error) {
      return Promise.reject(error);
  }
};//End of Function

/**********************************************************************
 * Function Name    :   updateData
 * Purposs          :   This function is used for update Winners
 * Created By       :   Afsar Ali
 * Created Data     :   10-SEPT-2024
 * Updated By       :   
 * Update Data      :
 * Remarks          : 
 **********************************************************************/
exports.updateData = async function (options) {
  try {
    const {condition, data} = options;
    return await Winners.findByIdAndUpdate(condition, data, {new: true})
  } catch (error) {
    return Promise.reject(error);
  }
}//End of Function