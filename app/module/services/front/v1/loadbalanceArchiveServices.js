const Loadbalance = require('../../../../models/uw_loadBalance_archives');
/**********************************************************************
 * Function Name    :   select
 * Purposs          :   This function is used for select from vendorservices table
 * Created By       :   Afsar Ali
 * Created Data     :   11-SEPT-2024
 * Updated By       :   
 * Update Data      :
 * Remarks          : 
 **********************************************************************/
exports.select = async function (options) {
    try {
      const { type, condition={}, select={}, sort={}, skip, limit } = options;
      if(type === 'count'){
        // return await Services.find(condition).count();
        return await Loadbalance.countDocuments(condition);
      } else if(type === 'single'){
        return await Loadbalance.findOne(condition).select(select);
      } else {
        return await Loadbalance.find(condition).select(select).sort(sort).skip(skip).limit(limit);
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
      return await Loadbalance.insertMany(options);
  } catch (error) {
      return Promise.reject(error);
  }
};//End of Function

/**********************************************************************
 * Function Name    :   updateData
 * Purposs          :   This function is used for update Loadbalance
 * Created By       :   Afsar Ali
 * Created Data     :   11-SEPT-2024
 * Updated By       :   
 * Update Data      :
 * Remarks          : 
 **********************************************************************/
exports.updateData = async function (options) {
  try {
    const {condition, data} = options;
    return await Loadbalance.findByIdAndUpdate(condition, data, {new: true})
  } catch (error) {
    return Promise.reject(error);
  }
}//End of Function

/**********************************************************************
 * Function Name    :   updateData
 * Purposs          :   This function is used for update Loadbalance
 * Created By       :   Afsar Ali
 * Created Data     :   11-SEPT-2024
 * Updated By       :   
 * Update Data      :
 * Remarks          : 
 **********************************************************************/
exports.deleteData = async function (options) {
  try {
    return await Loadbalance.deleteMany(options)
  } catch (error) {
    return Promise.reject(error);
  }
}//End of Function