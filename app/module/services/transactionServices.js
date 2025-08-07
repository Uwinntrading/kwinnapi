const transactions = require("../../models/crm_transactions");

/**********************************************************************
 * Function Name    :   select
 * Purpose          :   This function is used for select from table
 * Created By       :   Afsar Ali
 * Created Data     :   24-05-2025
 * Updated By       :   
 * Update Data      :
 **********************************************************************/
exports.select = async function (options) {
    try {
      const { type, condition={}, select={}, sort={}, skip, limit } = options;
      if(type === 'count'){
        return await transactions.countDocuments(condition);
      } else if(type === 'single'){
        return await transactions.findOne(condition).select(select);
      } else {
        return await transactions.find(condition).select(select).sort(sort).skip(skip).limit(limit);
      }
    } catch (error) {
      return Promise.reject(error);
    }
}//End of Function

/**********************************************************************
 * Function Name    :   select
 * Purpose          :   This function is used for select from table
 * Created By       :   Afsar Ali
 * Created Data     :   24-05-2025
 * Updated By       :   
 * Update Data      :
 **********************************************************************/
exports.selectDetails = async function (options) {
    try {
      const { type, condition={}, select={}, sort={}, skip, limit } = options;
      if(type === 'count'){
        return await transactions.countDocuments(condition);
      } else if(type === 'single'){
        return await transactions.findOne(condition).select(select)
        .populate([
          {
            path: "debit_user",
            model: "kw_users",
            select : "users_type users_id users_name last_name users_mobile users_email area store_name"
          },
          {
            path: "from_user",
            model: "kw_users",
            select : "users_type users_id users_name last_name users_mobile users_email area store_name"
          },
          {
            path: "credit_user",
            model: "kw_users",
            select : "users_type users_id users_name last_name users_mobile users_email area store_name"
          },
          {
            path: "created_by",
            model: "kw_users",
            select : "users_type users_id users_name last_name users_mobile users_email area store_name"
          },
        ]);
      } else {
        return await transactions.find(condition).select(select)
        .populate([
          {
            path: "debit_user",
            model: "kw_users",
            select : "users_type users_id users_name last_name users_mobile users_email area store_name"
          },
          {
            path: "from_user",
            model: "kw_users",
            select : "users_type users_id users_name last_name users_mobile users_email area store_name"
          },
          {
            path: "credit_user",
            model: "kw_users",
            select : "users_type users_id users_name last_name users_mobile users_email area store_name"
          },
          {
            path: "created_by",
            model: "kw_users",
            select : "users_type users_id users_name last_name users_mobile users_email area store_name"
          },
        ])
        .sort(sort).skip(skip).limit(limit);
      }
    } catch (error) {
      return Promise.reject(error);
    }
}//End of Function

/**********************************************************************
 * Function Name    :   create
 * Purpose          :   This function is used for insert new entry in table
 * Created By       :   Afsar Ali
 * Created Data     :   24-05-2025
 * Updated By       :   
 * Update Data      :
 * Remarks          : 
 **********************************************************************/
exports.create = async (options) => {
    try {
        return await transactions.create(options);
    } catch (error) {
        return Promise.reject(error);
    }
};//End of Function

/**********************************************************************
 * Function Name    :   bulk_create
 * Purpose          :   This function is used for bulk insert in table
 * Created By       :   Afsar Ali
 * Created Data     :   24-05-2025
 * Updated By       :   
 * Update Data      :
 * Remarks          : 
 **********************************************************************/
exports.bulk_create = async (options) => {
  try {
      return await transactions.insertMany(options);
  } catch (error) {
      return Promise.reject(error);
  }
};//End of Function

/**********************************************************************
 * Function Name    :   updateData
 * Purpose          :   This function is used for update in table
 * Created By       :   Afsar Ali
 * Created Data     :   24-05-2025
 * Updated By       :   
 * Update Data      :
 * Remarks          : 
 **********************************************************************/
exports.updateData = async (options) => {
  try {
    const {condition, data} = options;
      return await transactions.findOneAndUpdate(condition, data, {new: true});
  } catch (error) {
      return Promise.reject(error);
  }
};//End of Function