const campaignModel = require("../../../../models/kw_campaigns");
const settingModel = require("../../../../models/kw_settings");
const campaignDraws = require("../../../../models/kw_campaign_draws");
/**********************************************************************
 * Function Name    :   select
 * Purpose          :   This function is used for select from campaigns table
 * Created By       :   Afsar Ali
 * Created Data     :   10-01-2025
 * Updated By       :   
 * Update Data      :
 **********************************************************************/
exports.select = async function (options) {
    try {
      const { type, condition={}, select={}, sort={}, skip, limit } = options;
      if(type === 'count'){
        return await campaignModel.countDocuments(condition);
      } else if(type === 'single'){
        return await campaignModel.findOne(condition).select(select);
      } else {
        return await campaignModel.find(condition).select(select).sort(sort).skip(skip).limit(limit);
      }
    } catch (error) {
      return Promise.reject(error);
    }
}//End of Function

/**********************************************************************
 * Function Name    :   select_details
 * Purpose          :   This function is used for select from campaigns details
 * Created By       :   Afsar Ali
 * Created Data     :   10-01-2025
 * Updated By       :   
 * Update Data      :
 **********************************************************************/
exports.select_details = async function (options) {
  try {
    const { type, condition={}, select={}, sort={}, skip, limit } = options;
    if(type === 'count'){
      return await campaignModel.countDocuments(condition);
    } else if(type === 'single'){
      return await campaignModel.findOne(condition).select(select)
      .populate([
        {
          path : "draw_id",
          model : "kw_campaign_draws",
          select : "draw_date draw_time draw_date_time status"
        },
        {
          path : "prizeData",
          model : "kw_prizes",
          select : ""
        },
        {
          path : "settingData",
          model : "kw_settings",
          select : ""
        }
      ]);
    } else {
      return await campaignModel.find(condition).select(select)
      .populate([
        {
          path : "draw_id",
          model : "kw_campaign_draws",
          select : "draw_date draw_time draw_date_time status"
        },
        {
          path : "prizeData",
          model : "kw_prizes",
          select : ""
        },
        {
          path : "settingData",
          model : "kw_settings",
          select : ""
        }
      ]).sort(sort).skip(skip).limit(limit);
    }
  } catch (error) {
    return Promise.reject(error);
  }
}//End of Function

/**********************************************************************
 * Function Name    :   createdata
 * Purpose          :   This function is used for update productInventory
 * Created By       :   Afsar Ali
 * Created Data     :   24-12-2024
 * Updated By       :   
 * Update Data      :
 **********************************************************************/
exports.createData = async function (options) {
    try {
      return await campaignModel.create(options)
    } catch (error) {
      return Promise.reject(error);
    }
  }//End of Function
  /**********************************************************************
   * Function Name    :   updateData
   * Purpose          :   This function is used for update productInventory
   * Created By       :   Afsar Ali
   * Created Data     :   24-12-2024
   * Updated By       :   
   * Update Data      :
   **********************************************************************/
  exports.updateData = async function (options) {
    try {
      const {condition, data} = options;
      return await campaignModel.findByIdAndUpdate(condition, data, {new: true})
    } catch (error) {
      return Promise.reject(error);
    }
  }//End of Function

  /**********************************************************************
 * Function Name    :   select_setting
 * Purpose          :   This function is used for select from setting table
 * Created By       :   Afsar Ali
 * Created Data     :   10-01-2025
 * Updated By       :   
 * Update Data      :
 **********************************************************************/
exports.select_setting = async function (options) {
  try {
    const { type, condition={}, select={}, sort={}, skip, limit } = options;
    if(type === 'count'){
      return await settingModel.countDocuments(condition);
    } else if(type === 'single'){
      return await settingModel.findOne(condition).select(select);
    } else {
      return await settingModel.find(condition).select(select).sort(sort).skip(skip).limit(limit);
    }
  } catch (error) {
    return Promise.reject(error);
  }
}//End of Function

/**********************************************************************
 * Function Name    :   getCampaignById
 * Purpose          :   This function is used for get campaign data by Id
 * Created By       :   Afsar Ali
 * Created Data     :   08-01-2025
 * Updated By       :   
 * Update Data      :
 * Remarks          : 
 **********************************************************************/
exports.getCampaignById = async function (options) {
  try {
      return await campaignModel.findById(options)
  } catch (error) {
    return Promise.reject(error);
  }
}//End of Function

/**********************************************************************
 * Function Name    :   select_draw
 * Purpose          :   This function is used for select from campaigns draw table
 * Created By       :   Afsar Ali
 * Created Data     :   09-01-2025
 * Updated By       :   
 * Update Data      :
 * Remarks          : 
 **********************************************************************/
exports.select_draw = async function (options) {
  try {
    const { type, condition={}, select={}, sort={}, skip, limit } = options;
    if(type === 'count'){
      return await campaignDraws.countDocuments(condition);
    } else if(type === 'single'){
      return await campaignDraws.findOne(condition).select(select);
    } else {
      return await campaignDraws.find(condition).select(select).sort(sort).skip(skip).limit(limit);
    }
  } catch (error) {
    return Promise.reject(error);
  }
}//End of Function
