const Orders = require('../../../../models/kw_lotto_orders');
/**********************************************************************
 * Function Name    :   select
 * Purposs          :   This function is used for select from vendorservices table
 * Created By       :   Afsar Ali
 * Created Data     :   19-MARCH-2024
 * Updated By       :   
 * Update Data      :
 * Remarks          : 
 **********************************************************************/
exports.select = async function (options) {
    try {
      const { type, condition={}, select={}, sort={}, skip, limit } = options;
      if(type === 'count'){
        // return await Services.find(condition).count();
        return await Orders.countDocuments(condition);
      } else if(type === 'single'){
        return await Orders.findOne(condition).select(select);
      } else {
        return await Orders.find(condition).select(select).sort(sort).skip(skip).limit(limit);
      }
    } catch (error) {
      return Promise.reject(error);
    }
}//End of Function

/**********************************************************************
 * Function Name    :   select
 * Purposs          :   This function is used for select from vendorservices table
 * Created By       :   Afsar Ali
 * Created Data     :   19-MARCH-2024
 * Updated By       :   
 * Update Data      :
 * Remarks          : 
 **********************************************************************/
exports.selectWithPopulate = async function (options) {
  try {
    const { type, condition={}, select={}, sort={}, skip, limit } = options;
    if(type === 'count'){
      // return await Services.find(condition).count();
      return await Orders.countDocuments(condition);
    } else if(type === 'single'){
      return await Orders.findOne(condition).select(select)
      .populate([
        {
          path : "user_data",
          model : "kw_users",
          select : "_id users_type users_name last_name users_email country_code users_mobile users_seq_id status commission_percentage store_name "
        },
        {
          path : "product_data",
          model : "kw_products",
          select : "",
          populate :[
            {
              path : "prize_data",
              model : "kw_prize",
              select : ""
            }
          ]
        }
      ]);
    } else {
      return await Orders.find(condition).select(select)
      .populate([
        {
          path : "user_data",
          model : "kw_users",
          select : "_id users_type users_name last_name users_email country_code users_mobile users_seq_id status commission_percentage store_name "
        },
        {
          path : "product_data",
          model : "kw_products",
          select : "",
          populate :[
            {
              path : "prize_data",
              model : "kw_prize",
              select : ""
            }
          ]
        }
      ])
      .sort(sort).skip(skip).limit(limit);
    }
  } catch (error) {
    return Promise.reject(error);
  }
}//End of Function

/**********************************************************************
 * Function Name    :   selectDrawListWithPopulate
 * Purpose          :   This function is used for select from select draw list with populate table
 * Created By       :   Afsar Ali
 * Created Data     :   09-NOV-2024
 * Updated By       :   
 * Update Data      :
 * Remarks          : 
 **********************************************************************/
exports.selectDrawListWithPopulate = async function (options) {
  try {
    const { type, condition={}, select={}, sort={}, skip, limit } = options;
    if(type === 'count'){
      return await Orders.countDocuments(condition);
    } else if(type === 'single'){
      return await Orders.findOne(condition).select(select)
      .populate([
        {
          path : "user_data",
          model : "kw_users",
          select : "_id users_type users_name last_name users_email country_code users_mobile users_seq_id status commission_percentage store_name bind_person_name "
        },
        {
          path : "product_data",
          model : "kw_products",
          select : "",
          populate :[
            {
              path : "prize_data",
              model : "kw_prize",
              select : ""
            }
          ]
        }
      ]);
    } else {
      return await Orders.find(condition).select(select)
      .populate([
        {
          path : "user_data",
          model : "kw_users",
          select : "_id users_type users_name last_name users_email country_code users_mobile users_seq_id status commission_percentage store_name bind_person_name "
        },
        {
          path : "product_data",
          model : "kw_products",
          select : "",
          populate :[
            {
              path : "prize_data",
              model : "kw_prize",
              select : ""
            }
          ]
        }
      ])
      .sort(sort).skip(skip).limit(limit);
    }
  } catch (error) {
    return Promise.reject(error);
  }
}//End of Function

/**********************************************************************
 * Function Name    :   createData
 * Purposs          :   This function is used for create orders
 * Created By       :   Afsar Ali
 * Created Data     :   05-NOV-2024
 * Updated By       :   
 * Update Data      :
 * Remarks          : 
 **********************************************************************/
exports.createData = async function (options) {
  try {
    return await Orders.create(options);
  } catch (error) {
    return Promise.reject(error);
  }
}//End of Function

/**********************************************************************
 * Function Name    :   updateData
 * Purposs          :   This function is used for update orders
 * Created By       :   Afsar Ali
 * Created Data     :   10-SEPT-2024
 * Updated By       :   
 * Update Data      :
 * Remarks          : 
 **********************************************************************/
exports.updateData = async function (options) {
  try {
    const {condition, data} = options;
    return await Orders.findByIdAndUpdate(condition, data, {new: true})
  } catch (error) {
    return Promise.reject(error);
  }
}//End of Function

/**********************************************************************
 * Function Name    :   updateData
 * Purposs          :   This function is used for update orders
 * Created By       :   Afsar Ali
 * Created Data     :   10-SEPT-2024
 * Updated By       :   
 * Update Data      :
 * Remarks          : 
 **********************************************************************/
exports.deleteData = async function (options) {
  try {
    return await Orders.deleteMany(options)
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
    return await Orders.aggregate(pipeline);
  } catch (error) {
    return Promise.reject(error);
  }
}//End of Function