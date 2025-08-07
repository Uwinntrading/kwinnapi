const Invoice = require('../../models/invoices_requests');
/**********************************************************************
 * Function Name    :   select
 * Purpose          :   This function is used for select from invoice table
 * Created By       :   Afsar Ali
 * Created Data     :   07-04-2025
 * Updated By       :   
 * Update Data      :
 * Remarks          : 
 **********************************************************************/
exports.select = async function (options) {
    try {
      const { type, condition={}, select={}, sort={}, skip, limit, populate={} } = options;
      if(type === 'count'){
        return await Invoice.find(condition).countDocuments();
      } else if(type === 'single'){
        return await Invoice.findOne(condition).select(select);
      } else {
        return await Invoice.find(condition).sort(sort).skip(skip).limit(limit);
      }
    } catch (error) {
      return Promise.reject(error);
    }
}//End of Function
/**********************************************************************
 * Function Name    :   create
 * Purpose          :   This function is used for insert new entry in invoice table
 * Created By       :   Afsar Ali
 * Created Data     :   07-04-2025
 * Updated By       :   
 * Update Data      :
 * Remarks          : 
 **********************************************************************/
exports.create = async (options) => {
    try {
        return await Invoice.create(options);
    } catch (error) {
        return Promise.reject(error);
    }
};//End of Function

/**********************************************************************
 * Function Name    :   create
 * Purpose          :   This function is used for insert new entry in invoice table
 * Created By       :   Afsar Ali
 * Created Data     :   07-04-2025
 * Updated By       :   
 * Update Data      :
 * Remarks          : 
 **********************************************************************/
exports.updateData = async (options) => {
  try {
    const {condition, data} = options;
      return await Invoice.findOneAndUpdate(condition, data, {new: true});
  } catch (error) {
      return Promise.reject(error);
  }
};//End of Function
/**********************************************************************
 * Function Name    :   getUserById
 * Purpose          :   This function is used for select by id in invoice table
 * Created By       :   Afsar Ali
 * Created Data     :   07-04-2025
 * Updated By       :   
 * Update Data      :
 * Remarks          : 
 **********************************************************************/
exports.getUserById = async function (id) {
  try {
    return await Invoice.findById(id);
  } catch (error) {
    return Promise.reject(error);
  }
}

/**********************************************************************
 * Function Name    :   deleteOne
 * Purpose          :   This function is used for delete by condition in invoice table
 * Created By       :   Afsar Ali
 * Created Data     :   07-04-2025
 * Updated By       :   
 * Update Data      :
 * Remarks          : 
 **********************************************************************/
exports.deleteOne = async function (id) {
  try {
    if(id){
      return await Invoice.findByIdAndDelete(id);
    }
  } catch (error) {
    return Promise.reject(error);
  }
}