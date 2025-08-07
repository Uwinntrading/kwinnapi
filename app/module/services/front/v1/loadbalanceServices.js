const Loadbalance = require('../../../../models/kw_loadBalance');
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
 * Function Name    :   select_summery
 * Purpose          :   This function is used for select from loadbalance table
 * Created By       :   Afsar Ali
 * Created Data     :   23-01-2025
 * Updated By       :   
 * Update Data      :
 * Remarks          : 
 **********************************************************************/
exports.select_summery = async function (options) {
  try {
    const { type, condition={}, select={}, sort={}, skip, limit } = options;
    if(type === 'count'){
      return await Loadbalance.countDocuments(condition);
    } else if(type === 'single'){
      return await Loadbalance.findOne(condition).select(select)
      .populate([
        {
          path: "campaignOrderData",
          model: "kw_campaign_orders",
          select : "campaign_title"
        }
      ]);
    } else {
      return await Loadbalance.find(condition).select(select)
      .populate([
        {
          path: "campaignOrderData",
          model: "kw_campaign_orders",
          select : "campaign_title"
        }
      ]).sort(sort).skip(skip).limit(limit);
    }
  } catch (error) {
    return Promise.reject(error);
  }
}//End of Function
/**********************************************************************
 * Function Name    :   createdata
 * Purposs          :   This function is used for update Loadbalance
 * Created By       :   Afsar Ali
 * Created Data     :   11-SEPT-2024
 * Updated By       :   
 * Update Data      :
 * Remarks          : 
 **********************************************************************/
exports.createData = async function (options) {
  try {
    return await Loadbalance.create(options)
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
exports.updateData = async function (options) {
  try {
    const {condition, data} = options;
    return await Loadbalance.findByIdAndUpdate(condition, data, {new: true})
  } catch (error) {
    return Promise.reject(error);
  }
}//End of Function

 
/**********************************************************************
 * Function Name    :   updateManyData
 * Purpose          :   This function is used for update lotto winners 
 * Created By       :   Dilip Halder
 * Created Data     :   18-02-2025
 * Updated By       :   
 * Update Data      :
 **********************************************************************/
exports.updateManyData = async function (options) {
  try {
    const {condition, data} = options;
      return await Loadbalance.updateMany(condition, data, {new :true});
  } catch (error) {
    return Promise.reject(error);
  }
}//End of Function

/**********************************************************************
 * Function Name    :   deleteData
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
/**********************************************************************
 * Function Name    :   aggregate
 * Purposs          :   This function is used for aggregate
 * Created By       :   Afsar Ali
 * Created Data     :   09-NOV-2024
 * Updated By       :   
 * Update Data      :
 * Remarks          : 
 **********************************************************************/
exports.aggregate = async function (pipeline) {
  try {
    return await Loadbalance.aggregate(pipeline);
  } catch (error) {
    return Promise.reject(error);
  }
}//End of Function