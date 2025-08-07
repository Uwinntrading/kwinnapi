const ticketsModel = require("../../../../../models/kw_campaign_tickets");

/**********************************************************************
 * Function Name    :   select
 * Purpose          :   This function is used for select from campaign order ticket table
 * Created By       :   Afsar Ali
 * Created Data     :   16-01-2025
 * Updated By       :   
 * Update Data      :
 **********************************************************************/
exports.select = async function (options) {
    try {
      const { type, condition={}, select={}, sort={}, skip, limit } = options;
      if(type === 'count'){
        return await ticketsModel.countDocuments(condition);
      } else if(type === 'single'){
        return await ticketsModel.findOne(condition).select(select);
      } else {
        return await ticketsModel.find(condition).select(select).sort(sort).skip(skip).limit(limit);
      }
    } catch (error) {
      return Promise.reject(error);
    }
}//End of Function

/**********************************************************************
 * Function Name    :   select_details
 * Purpose          :   This function is used for select from campaign order ticket table
 * Created By       :   Afsar Ali
 * Created Data     :   16-01-2025
 * Updated By       :   
 * Update Data      :
 **********************************************************************/
exports.select_details = async function (options) {
  try {
    const { type, condition={}, select={}, sort={}, skip, limit } = options;
    if(type === 'count'){
      return await ticketsModel.countDocuments(condition);
    } else if(type === 'single'){
      return await ticketsModel.findOne(condition).select(select)
      .populate([
        {
          path : "seller_user_id",
          model : "kw_users",
          select : "users_type users_name users_mobile"
        }
      ]);
    } else {
      return await ticketsModel.find(condition).select(select)
      .populate([
        {
          path : "seller_user_id",
          model : "kw_users",
          select : "users_type users_name users_mobile"
        }
      ]).sort(sort).skip(skip).limit(limit);
    }
  } catch (error) {
    return Promise.reject(error);
  }
}//End of Function

  /**********************************************************************
   * Function Name    :   updateData
   * Purpose          :   This function is used for update campaign ticket order
   * Created By       :   Afsar Ali
   * Created Data     :   16-01-2025
   * Updated By       :   
   * Update Data      :
   **********************************************************************/
  exports.updateData = async function (options) {
    try {
      const {condition, data} = options;
      return await ticketsModel.updateMany(condition, data, {new: true})
    } catch (error) {
      return Promise.reject(error);
    }
  }//End of Function

  /**********************************************************************
   * Function Name    :   getDataById
   * Purpose          :   This function is used for get data by ID
   * Created By       :   Afsar Ali
   * Created Data     :   16-01-2025
   * Updated By       :   
   * Update Data      :
   **********************************************************************/
  exports.getDataById = async function (id) {
      try {
        return await ticketsModel.findById(id);
      } catch (error) {
        return Promise.reject(error);
      }
    }