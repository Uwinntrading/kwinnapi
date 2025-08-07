const loadBalance = require("../../models/kw_loadBalance");
const userModel = require("../../models/kw_users");
const invoice = require("../../models/Invoices");
/**********************************************************************
 * Function Name    :   selectLoadBalance
 * Purpose          :   This function is used for select from loadbalance table
 * Created By       :   Afsar Ali
 * Created Data     :   04-04-2025
 * Updated By       :   
 * Update Data      :
 * Remarks          : 
 **********************************************************************/
exports.selectLoadBalance = async function (options) {
    try {
      const { type, condition={}, select={}, sort={}, skip, limit } = options;
      if(type === 'count'){
        return await loadBalance.find(condition).countDocuments();
      } else if(type === 'single'){
        return await loadBalance.findOne(condition).select(select);
      } else {
        return await loadBalance.find(condition).sort(sort).skip(skip).limit(limit);
      }
    } catch (error) {
      return Promise.reject(error);
    }
}//End of Function
/**********************************************************************
 * Function Name    :   selectUsers
 * Purpose          :   This function is used for select from loadbalance table
 * Created By       :   Afsar Ali
 * Created Data     :   08-04-2025
 * Updated By       :   
 * Update Data      :
 * Remarks          : 
 **********************************************************************/
exports.selectUsers = async function (options) {
  try {
    const { type, condition={}, select={}, sort={}, skip, limit } = options;
    if(type === 'count'){
      return await userModel.find(condition).countDocuments();
    } else if(type === 'single'){
      return await userModel.findOne(condition).select(select);
    } else {
      return await userModel.find(condition).sort(sort).skip(skip).limit(limit);
    }
  } catch (error) {
    return Promise.reject(error);
  }
}//End of Function
/**********************************************************************
 * Function Name    :   selectInvoice
 * Purpose          :   This function is used for select from invoice table
 * Created By       :   Afsar Ali
 * Created Data     :   07-04-2025
 * Updated By       :   
 * Update Data      :
 * Remarks          : 
 **********************************************************************/
exports.selectInvoice = async function (options) {
  try {
    const { type, condition={}, select={}, sort={}, skip, limit } = options;
    if(type === 'count'){
      return await invoice.find(condition).countDocuments();
    } else if(type === 'single'){
      return await invoice.findOne(condition).select(select);
    } else {
      return await invoice.find(condition).sort(sort).skip(skip).limit(limit);
    }
  } catch (error) {
    return Promise.reject(error);
  } 
}//End of Function
/**********************************************************************
 * Function Name    :   insertInvoice
 * Purpose          :   This function is used for insert into invoice table
 * Created By       :   Afsar Ali
 * Created Data     :   07-04-2025
 * Updated By       :   
 * Update Data      :
 * Remarks          : 
 **********************************************************************/
exports.insertInvoice = async function (data) {
  try {
    return await invoice.create(data);
  } catch (error) {
    return Promise.reject(error);
  }
}//End of Function
/**********************************************************************
 * Function Name    :   bulk_create
 * Purpose          :   This function is used for insert into invoice table
 * Created By       :   Afsar Ali
 * Created Data     :   07-04-2025
 * Updated By       :   
 * Update Data      :
 * Remarks          : 
 **********************************************************************/
exports.bulk_create = async function (data) {
  try {
    return await invoice.insertMany(data);
  } catch (error) {
    return Promise.reject(error);
  }
}//End of Function
/**********************************************************************
 * Function Name    :   updateInvoice
 * Purpose          :   This function is used for update invoice table
 * Created By       :   Afsar Ali
 * Created Data     :   07-04-2025
 * Updated By       :   
 * Update Data      :
 * Remarks          : 
 **********************************************************************/ 
exports.updateInvoice = async (options) => {
  try {
    const {condition, data} = options;
      return await invoice.findOneAndUpdate(condition, data, {new: true});
  } catch (error) {
      return Promise.reject(error);
  }
};//End of Function
/**********************************************************************
 * Function Name    :   deleteInvoice
 * Purpose          :   This function is used for delete invoice table
 * Created By       :   Afsar Ali
 * Created Data     :   07-04-2025
 * Updated By       :   
 * Update Data      :
 * Remarks          : 
 **********************************************************************/
exports.deleteInvoice = async (condition) => {
  try {
    return await invoice.findOneAndDelete(condition);
  } catch (error) {
    return Promise.reject(error);
  }
};//End of Function

/**********************************************************************
 * Function Name    :   deleteOne
 * Purpose          :   This function is used for delete by condition in invoice table
 * Created By       :   Afsar Ali
 * Created Data     :   15-JAN-2024
 * Updated By       :   
 * Update Data      :
 * Remarks          : 
 **********************************************************************/
exports.deleteOne = async function (id) {
  try {
    if(id){
      return await invoice.findByIdAndDelete(id);
    }
  } catch (error) {
    return Promise.reject(error);
  }
}