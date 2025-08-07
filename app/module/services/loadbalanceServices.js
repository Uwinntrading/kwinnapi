const Loadbalance = require('../../models/kw_loadBalance');
/**********************************************************************
 * Function Name    :   select
 * Purpose          :   This function is used for select from vendorservices table
 * Created By       :   Afsar Ali
 * Created Data     :   14-12-2024
 * Updated By       :   
 * Update Data      :
 * Remarks          : 
 **********************************************************************/
exports.select = async function (options) {
    try {
      const { type, condition={}, select={}, sort={}, skip, limit } = options;
      if(type === 'count'){
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
 * Function Name    :   select_point_txn
 * Purpose          :   This function is used for select from select b-point recharge transaction.
 * Created By       :   Afsar Ali
 * Created Data     :   16-12-2024
 * Updated By       :   
 * Update Data      :
 * Remarks          : 
 **********************************************************************/
exports.select_point_txn = async function (options) {
  try {
    const { type, condition={}, select={}, sort={}, skip, limit } = options;
    if(type === 'count'){
      return await Loadbalance.countDocuments(condition);
    } else if(type === 'single'){
      return await Loadbalance.findOne(condition).select(select)
      .populate([
        {
          path : "credit_user",
          model : "kw_users",
          select : "users_type users_name last_name users_mobile availableArabianPoints totalArabianPoints availableReachargePoints end_ReachargePoints"
        },
        {
          path : "debit_user",
          model : "kw_users",
          select : "users_type users_name last_name users_mobile availableArabianPoints totalArabianPoints availableReachargePoints end_ReachargePoints"
        }
      ]);
    } else {
      return await Loadbalance.find(condition).select(select)
      .populate([
        {
          path : "credit_user",
          model : "kw_users",
          select : "users_type users_name last_name users_mobile availableArabianPoints totalArabianPoints availableReachargePoints end_ReachargePoints"
        },
        {
          path : "debit_user",
          model : "kw_users",
          select : "users_type users_name last_name users_mobile availableArabianPoints totalArabianPoints availableReachargePoints end_ReachargePoints"
        }
      ]).sort(sort).skip(skip).limit(limit);
    }
  } catch (error) {
    return Promise.reject(error);
  }
}//End of Function
/**********************************************************************
 * Function Name    :   createdata
 * Purpose          :   This function is used for update Loadbalance
 * Created By       :   Afsar Ali
 * Created Data     :   14-12-2024
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
 * Purpose          :   This function is used for update Loadbalance
 * Created By       :   Afsar Ali
 * Created Data     :   14-12-2024
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
 * Purpose          :   This function is used for update Loadbalance
 * Created By       :   Afsar Ali
 * Created Data     :   14-12-2024
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
 * Purpose          :   This function is used for aggregate
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