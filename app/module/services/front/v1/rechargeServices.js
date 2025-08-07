const Recharge = require('../../../../models/kw_recharges');
const RechargeCountry = require('../../../../models/kw_recharge_countries');
const RechargeProviders = require('../../../../models/kw_recharge_providers');
const RechargePlans = require('../../../../models/kw_recharge_plans');
/**********************************************************************
 * Function Name    :   select
 * Purpose          :   This function is used to get user data by condition.
 * Created By       :   Dilip Halder
 * Created Data     :   15-October-2024
 **********************************************************************/
exports.select = async function (options) {
    try {
      const { type, condition, select, sort, skip, limit } = options;
      if(type === 'count'){
        return await Recharge.countDocuments(condition);
      } else if(type === 'single'){
        return await Recharge.findOne(condition).select(select);
      } else {
        return await Recharge.find(condition).select(select).sort(sort).skip(skip).limit(limit);
      }
    } catch (error) {
      return Promise.reject(error);
    }
}//End of Function

/**********************************************************************
 * Function Name    :   select_details
 * Purpose          :   This function is used to get user data by condition.
 * Created By       :   Dilip Halder
 * Created Data     :   23-04-2025
 * Updated By       :   
 * Update Data      :
 **********************************************************************/
exports.select_details = async function (options) {
  try {
    const { type, condition={}, select={}, sort={}, skip, limit } = options;
    if(type === 'count'){

      return await Recharge.countDocuments(condition);
    } else if(type === 'single'){

      return await Recharge.findOne(condition).select(select)
      .populate([
        {
          path : "rechargeData",
          model : "kw_loadBalance",
          select : ""
        },
      ]).sort(sort).skip(skip).limit(limit);

    } else {

      return await Recharge.find(condition).select(select)
      .populate([
        {
          path   : "rechargeData",
          model  : "kw_loadBalance",
          select : "points record_type narration",
          match  : { narration: 'Mobile Recharge Commission' } // Use 'match' instead of 'where'
        },
      ]).sort(sort).skip(skip).limit(limit);

    }
  } catch (error) {
    return Promise.reject(error);
  }
}//End of Function

/**********************************************************************
 * Function Name    :   updateData
 * Purpose          :   This function is used for update Recharge
 * Created By       :   Dilip Halder
 * Created Data     :   15-October-2024
 **********************************************************************/
exports.updateData = async function (options) {
  try {
    const {condition, data} = options;
    return await Recharge.findByIdAndUpdate(condition, data, {new: true})
  } catch (error) {
    return Promise.reject(error);
  }
}//End of Function

/**********************************************************************
 * Function Name    :   createDate
 * Purpose          :   This function is used for create new
 * Created By       :   Afsar Ali
 * Created Data     :   21-October-2024
 **********************************************************************/
exports.createDate = async function (options) {
  try {
    return await Recharge.create(options)
  } catch (error) {
    return Promise.reject(error);
  }
}//End of Function

/**********************************************************************
 * Function Name    :   updateData
 * Purpose          :   This function is used for update Recharge
 * Created By       :   Dilip Halder
 * Created Data     :   15-October-2024
 **********************************************************************/
exports.deleteData = async function (options) {
  try {
    return await Recharge.deleteMany(options)
  } catch (error) {
    return Promise.reject(error);
  }
}//End of Function

exports.getDataById = async function (options) {
  try {
    const { condition={},select={} } = options;
    return await Recharge.findOne(condition).select(select);
  } catch (error) {
    return Promise.reject(error);
  }
}

exports.getUserById = async function (id) {
  try {
    return await Recharge.findById(id);
  } catch (error) {
    return Promise.reject(error);
  }
}


/**********************************************************************
 * Function Name    :   selectCountry
 * Purpose          :   This function is used to get country list.
 * Created By       :   Afsar ALi
 * Created Data     :   05-12-2024
 **********************************************************************/
exports.selectCountry = async function (options={}) {
  try {
    const { type, condition, select, sort, skip, limit } = options;
    if(type === 'count'){
      return await RechargeCountry.countDocuments(condition);
    } else if(type === 'single'){
      return await RechargeCountry.findOne(condition).select(select);
    } else {
      return await RechargeCountry.find(condition).select(select).sort(sort).skip(skip).limit(limit);
    }
  } catch (error) {
    return Promise.reject(error);
  }
}//End of Function

/**********************************************************************
 * Function Name    :   selectProviders
 * Purpose          :   This function is used to get providers list.
 * Created By       :   Afsar ALi
 * Created Data     :   05-12-2024
 **********************************************************************/
exports.selectProviders = async function (options={}) {
  try {
    const { type, condition, select, sort, skip, limit } = options;
    if(type === 'count'){
      return await RechargeProviders.countDocuments(condition);
    } else if(type === 'single'){
      return await RechargeProviders.findOne(condition).select(select);
    } else {
      return await RechargeProviders.find(condition).select(select).sort(sort).skip(skip).limit(limit);
    }
  } catch (error) {
    return Promise.reject(error);
  }
}//End of Function

/**********************************************************************
 * Function Name    :   selectPlans
 * Purpose          :   This function is used to get plans list.
 * Created By       :   Afsar ALi
 * Created Data     :   05-12-2024
 **********************************************************************/
exports.selectPlans = async function (options={}) {
  try {
    const { type, condition, select, sort, skip, limit } = options;
    if(type === 'count'){
      return await RechargePlans.countDocuments(condition);
    } else if(type === 'single'){
      return await RechargePlans.findOne(condition).select(select);
    } else {
      return await RechargePlans.find(condition).select(select).sort(sort).skip(skip).limit(limit);
    }
  } catch (error) {
    return Promise.reject(error);
  }
}//End of Function
/**********************************************************************
 * Function Name    :   rechargeAggregate
 * Purpose          :   This function is used for select from recharge 
 * Created By       :   Afsar Ali
 * Created Data     :   07-01-2025
 * Updated By       :   
 * Update Data      :
 **********************************************************************/
exports.rechargeAggregate = async function (options) {
  try {
      return await Recharge.aggregate(options);
  } catch (error) {
      return Promise.reject(error);
  }
}//End of Function