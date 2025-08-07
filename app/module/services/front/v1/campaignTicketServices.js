const ticketModel = require("../../../../models/kw_campaign_tickets");

/**********************************************************************
 * Function Name    :   select
 * Purpose          :   This function is used for select from campaign ticket table
 * Created By       :   Afsar Ali
 * Created Data     :   11-01-2025
 * Updated By       :   
 * Update Data      :
 **********************************************************************/
exports.select = async function (options) {
    try {
      const { type, condition={}, select={}, sort={}, skip, limit } = options;
      if(type === 'count'){
        return await ticketModel.countDocuments(condition);
      } else if(type === 'single'){
        return await ticketModel.findOne(condition).select(select);
      } else {
        return await ticketModel.find(condition).select(select).sort(sort).skip(skip).limit(limit);
      }
    } catch (error) {
      return Promise.reject(error);
    }
}//End of Function

/**********************************************************************
 * Function Name    :   select_details
 * Purpose          :   This function is used for select from campaign ticket table
 * Created By       :   Afsar Ali
 * Created Data     :   11-01-2025
 * Updated By       :   
 * Update Data      :
 **********************************************************************/
exports.select_details = async function (options) {
  try {
    const { type, condition={}, select={}, sort={}, skip, limit } = options;
    if(type === 'count'){
      return await ticketModel.countDocuments(condition);
    } else if(type === 'single'){
      return await ticketModel.findOne(condition).select(select)
      .populate([
        {
          path : "buyer_user_id",
          model : "kw_users",
          select : "users_type users_name users_mobile"
        },
        {
          path : "seller_user_id",
          model : "kw_users",
          select : "users_type users_name users_mobile"
        },
        {
          path : "promocode_data",
          model : "kw_promocodes",
          select : "seq_id title code valid_date expire_date points status"
        },
        {
          path : "voucher_number",
          model : "kw_vouchers",
          select : "voucher_number points status"
        }
      ]);
    } else {
      return await ticketModel.find(condition).select(select)
      .populate([
        {
          path : "buyer_user_id",
          model : "kw_users",
          select : "users_type users_name users_mobile"
        },
        {
          path : "seller_user_id",
          model : "kw_users",
          select : "users_type users_name users_mobile"
        },
        {
          path : "promocode_data",
          model : "kw_promocodes",
          select : "seq_id title code valid_date expire_date points status"
        },
        {
          path : "voucher_number",
          model : "kw_vouchers",
          select : "voucher_number points status"
        }
      ]).sort(sort).skip(skip).limit(limit);
    }
  } catch (error) {
    return Promise.reject(error);
  }
}//End of Function

/**********************************************************************
 * Function Name    :   createDate
 * Purpose          :   This function is used for create new
 * Created By       :   Afsar Ali
 * Created Data     :   11-01-2025
 **********************************************************************/
exports.createDate = async function (options) {
  try {
    return await ticketModel.insertMany(options)
  } catch (error) {
    return Promise.reject(error);
  }
}//End of Function

  /**********************************************************************
   * Function Name    :   updateData
   * Purpose          :   This function is used for update campaign ticket
   * Created By       :   Afsar Ali
   * Created Data     :   11-01-2025
   * Updated By       :   
   * Update Data      :
   **********************************************************************/
  exports.updateData = async function (options) {
    try {
      const {condition, data} = options;
      return await ticketModel.findByIdAndUpdate(condition, data, {new: true})
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
        return await ticketModel.findById(id);
      } catch (error) {
        return Promise.reject(error);
      }
    }