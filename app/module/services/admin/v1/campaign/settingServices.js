const settingModel = require("../../../../../models/kw_settings");
/**********************************************************************
 * Function Name    :   select
 * Purpose          :   This function is used for select from setting table
 * Created By       :   Afsar Ali
 * Created Data     :   09-01-2025
 * Updated By       :   
 * Update Data      :
 * Remarks          : 
 **********************************************************************/
exports.select = async function (options) {
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
 * Function Name    :   select_details
 * Purpose          :   This function is used for select from setting table
 * Created By       :   Afsar Ali
 * Created Data     :   09-01-2025
 * Updated By       :   
 * Update Data      :
 * Remarks          : 
 **********************************************************************/
exports.select_details = async function (options) {
  try {
    const { type, condition={}, select={}, sort={}, skip, limit } = options;
    if(type === 'count'){
      return await settingModel.countDocuments(condition);
    } else if(type === 'single'){
      return await settingModel.findOne(condition).select(select)
      .populate([
        {
          path: 'campaign_data', 
          model : "kw_campaigns",
          select: 'title image straight_add_on_amount rumble_add_on_amount chance_add_on_amount lotto_type show_on status'
        }
      ]);
    } else {
      return await settingModel.find(condition).select(select)
      .populate([
        {
          path: 'campaign_data', 
          model : "kw_campaigns",
          select: 'title image straight_add_on_amount rumble_add_on_amount chance_add_on_amount lotto_type show_on status'
        }
      ]).sort(sort).skip(skip).limit(limit);
    }
  } catch (error) {
    return Promise.reject(error);
  }
}//End of Function

/**********************************************************************
 * Function Name    :   createData
 * Purpose          :   This function is used for insert into setting 
 * Created By       :   Afsar Ali
 * Created Data     :   09-01-2025
 * Updated By       :   
 * Update Data      :
 * Remarks          : 
 **********************************************************************/
exports.createData = async function (options) {
  try {
      return await settingModel.create(options);
  } catch (error) {
    return Promise.reject(error);
  }
}//End of Function

/**********************************************************************
 * Function Name    :   updateData
 * Purpose          :   This function is used for update setting 
 * Created By       :   Afsar Ali
 * Created Data     :   09-01-2025
 * Updated By       :   
 * Update Data      :
 * Remarks          : 
 **********************************************************************/
exports.updateData = async function (options) {
  try {
    const {condition, data} = options;
      return await settingModel.findOneAndUpdate(condition, data, {new :true});
  } catch (error) {
    return Promise.reject(error);
  }
}//End of Function

/**********************************************************************
 * Function Name    :   getSettingById
 * Purpose          :   This function is used for get setting data by Id
 * Created By       :   Afsar Ali
 * Created Data     :   09-01-2025
 * Updated By       :   
 * Update Data      :
 * Remarks          : 
 **********************************************************************/
exports.getSettingById = async function (options) {
  try {
      return await settingModel.findById(options)
  } catch (error) {
    return Promise.reject(error);
  }
}//End of Function