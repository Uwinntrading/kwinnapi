const prizeModel = require("../../../../../models/kw_prizes");
/**********************************************************************
 * Function Name    :   select
 * Purpose          :   This function is used for select from prize table
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
        return await prizeModel.countDocuments(condition);
      } else if(type === 'single'){
        return await prizeModel.findOne(condition).select(select);
      } else {
        return await prizeModel.find(condition).select(select).sort(sort).skip(skip).limit(limit);
      }
    } catch (error) {
      return Promise.reject(error);
    }
}//End of Function

/**********************************************************************
 * Function Name    :   select_details
 * Purpose          :   This function is used for select from prize table
 * Created By       :   Afsar Ali
 * Created Data     :   15-01-2025
 * Updated By       :   
 * Update Data      :
 * Remarks          : 
 **********************************************************************/
exports.select_details = async function (options) {
  try {
    const { type, condition={}, select={}, sort={}, skip, limit } = options;
    if(type === 'count'){
      return await prizeModel.countDocuments(condition);
    } else if(type === 'single'){
      return await prizeModel.findOne(condition).select(select)
      .populate([
        {
          path: 'campaign_data', 
          model : "kw_campaigns",
          select: 'title image straight_add_on_amount rumble_add_on_amount chance_add_on_amount lotto_type show_on status'
        }
      ]);
    } else {
      return await prizeModel.find(condition).select(select)
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
 * Purpose          :   This function is used for insert into prize 
 * Created By       :   Afsar Ali
 * Created Data     :   09-01-2025
 * Updated By       :   
 * Update Data      :
 * Remarks          : 
 **********************************************************************/
exports.createData = async function (options) {
  try {
      return await prizeModel.create(options);
  } catch (error) {
    return Promise.reject(error);
  }
}//End of Function

/**********************************************************************
 * Function Name    :   updateData
 * Purpose          :   This function is used for update prize 
 * Created By       :   Afsar Ali
 * Created Data     :   09-01-2025
 * Updated By       :   
 * Update Data      :
 * Remarks          : 
 **********************************************************************/
exports.updateData = async function (options) {
  try {
    const {condition, data} = options;
      return await prizeModel.findOneAndUpdate(condition, data, {new :true});
  } catch (error) {
    return Promise.reject(error);
  }
}//End of Function

/**********************************************************************
 * Function Name    :   getPrizeById
 * Purpose          :   This function is used for get prize data by Id
 * Created By       :   Afsar Ali
 * Created Data     :   09-01-2025
 * Updated By       :   
 * Update Data      :
 * Remarks          : 
 **********************************************************************/
exports.getPrizeById = async function (options) {
  try {
      return await prizeModel.findById(options)
  } catch (error) {
    return Promise.reject(error);
  }
}//End of Function