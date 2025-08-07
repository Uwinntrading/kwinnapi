const orderModel = require("../../../../../models/kw_campaign_orders");

/**********************************************************************
 * Function Name    :   select
 * Purpose          :   This function is used for select from campaign order table
 * Created By       :   Afsar Ali
 * Created Data     :   11-01-2025
 * Updated By       :   
 * Update Data      :
 **********************************************************************/
exports.select = async function (options) {
    try {
      const { type, condition={}, select={}, sort={}, skip, limit } = options;
      if(type === 'count'){
        return await orderModel.countDocuments(condition);
      } else if(type === 'single'){
        return await orderModel.findOne(condition).select(select);
      } else {
        return await orderModel.find(condition).select(select).sort(sort).skip(skip).limit(limit);
      }
    } catch (error) {
      return Promise.reject(error);
    }
}//End of Function

/**********************************************************************
 * Function Name    :   select_details
 * Purpose          :   This function is used for select from campaign order table
 * Created By       :   Afsar Ali
 * Created Data     :   11-01-2025
 * Updated By       :   
 * Update Data      :
 **********************************************************************/
exports.select_details = async function (options) {
  try {
    const { type, condition={}, select={}, sort={}, skip, limit } = options;
    if(type === 'count'){
      return await orderModel.countDocuments(condition);
    } else if(type === 'single'){
      return await orderModel.findOne(condition).select(select)
      .populate([
        {
          path : "seller_user_id",
          model : "kw_users",
          select : "users_type users_name users_mobile"
        },
        {
          path : "ticket",
          model : "kw_campaign_tickets",
          select : ""
        }
      ]);
    } else {
      return await orderModel.find(condition).select(select)
      .populate([
        {
          path : "seller_user_id",
          model : "kw_users",
          select : "users_type users_name users_mobile"
        },
        {
          path : "ticket",
          model : "kw_campaign_tickets",
          select : ""
        }
      ]).sort(sort).skip(skip).limit(limit);
    }
  } catch (error) {
    return Promise.reject(error);
  }
}//End of Function

  /**********************************************************************
   * Function Name    :   updateData
   * Purpose          :   This function is used for update campaign order
   * Created By       :   Afsar Ali
   * Created Data     :   11-01-2025
   * Updated By       :   
   * Update Data      :
   **********************************************************************/
  exports.updateData = async function (options) {
    try {
      const {condition, data} = options;
      return await orderModel.findByIdAndUpdate(condition, data, {new: true})
    } catch (error) {
      return Promise.reject(error);
    }
  }//End of Function

  /**********************************************************************
   * Function Name    :   getDataById
   * Purpose          :   This function is used for get data by ID
   * Created By       :   Afsar Ali
   * Created Data     :   11-01-2025
   * Updated By       :   
   * Update Data      :
   **********************************************************************/
  exports.getDataById = async function (id) {
      try {
        return await orderModel.findById(id);
      } catch (error) {
        return Promise.reject(error);
      }
    }
  /**********************************************************************
   * Function Name    :   orderAggregate
   * Purpose          :   This function is used for get order
   * Created By       :   Afsar Ali
   * Created Data     :   12-05-2025
   * Updated By       :   
   * Update Data      :
   **********************************************************************/
  exports.orderAggregate = async function (pipeline) {
    try {
      return await orderModel.aggregate(pipeline);
    } catch (error) {
      return Promise.reject(error);
    }
  }
