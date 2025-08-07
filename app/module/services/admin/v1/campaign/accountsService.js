const UserModel = require('../../../../../models/kw_users');
/**********************************************************************
 * Function Name    :   select
 * Purpose          :   This function is used for select from table
 * Created By       :   Afsar Ali
 * Created Data     :   09-12-2024
 * Updated By       :   
 * Update Data      :
 * Remarks          : 
 **********************************************************************/
exports.users_select = async function (options) {
    try {
      const { type, condition={}, select={}, sort={}, skip, limit, populate={} } = options;
      if(type === 'count'){
        return await UserModel.find(condition).countDocuments();
      } else if(type === 'single'){
        return await UserModel.findOne(condition).select(select);
      } else {
        return await UserModel.find(condition).select(select).sort(sort).skip(skip).limit(limit);
      }
    } catch (error) {
      return Promise.reject(error);
    }
}//End of Function
/**********************************************************************
 * Function Name    :   createData
 * Purpose          :   This function is used for insert user table
 * Created By       :   Afsar Ali
 * Created Data     :   09-12-2024
 * Updated By       :   
 * Update Data      :
 * Remarks          : 
 **********************************************************************/
exports.users_createData = async function (params) {
    try {
      return await UserModel.create(params);
    } catch (error) {
      return Promise.reject(error);
    }
}//End of Function

/**********************************************************************
 * Function Name    :   updateData
 * Purpose          :   This function is used for Update user table
 * Created By       :   Afsar Ali
 * Created Data     :   09-12-2024
 * Updated By       :   
 * Update Data      :
 * Remarks          : 
 **********************************************************************/
exports.users_updateData = async function (options) {
    try {
      const { condition={}, data={} } = options;
      return await UserModel.findOneAndUpdate(condition, data, {new: true});
    } catch (error) {
      return Promise.reject(error);
    }
}//End of Function
/**********************************************************************
 * Function Name    :   getUserById
 * Purpose          :   This function is used for get user details
 * Created By       :   Afsar Ali
 * Created Data     :   09-12-2024
 * Updated By       :   
 * Update Data      :
 * Remarks          : 
 **********************************************************************/
exports.users_getUserById = async function (id) {
    try {
      return await UserModel.findById(id);
    } catch (error) {
      return Promise.reject(error);
    }
}

/**********************************************************************
 * Function Name    :   select_users_inventory
 * Purpose          :   This function is used for get user details
 * Created By       :   Afsar Ali
 * Created Data     :   09-12-2024
 * Updated By       :   
 * Update Data      :
 * Remarks          : 
 **********************************************************************/
exports.select_users_inventory = async function (options) {
  try {
    const { type, condition={}, skip=0, limit=0 } = options;
    const pipeline = [
      {
        $match: {
          users_type: {$in : ['Freelancer','Sales Person', 'Retailer','Promoter']},
          status : "A",
          ...condition
        }
      },
      {
        $lookup: {
          from: "kw_product_inventories", 
          localField: "_id", 
          foreignField: "user_id", 
          as: "userInventory" 
        }
      },
      {
        $project: {
          _id: "$_id",
          users_name: "$users_name",
          last_name: "$last_name",
          users_mobile : "$users_mobile",
          pos_number : "$pos_number",
          bind_person_name : "$bind_person_name",
          bind_person_mobile : "$bind_person_mobile",
          bind_user_type : "$bind_user_type",
          store_name : "$store_name",
          area : "$area",
          users_type : "$users_type",
          availableArabianPoints : "$availableArabianPoints",
          inventory_count: { $size: "$userInventory" }
        }
      },
    ];
    if (skip) {
      pipeline.push({ $skip: skip });
    }
    
    if (limit) {
      pipeline.push({ $limit: limit });
    }
    if(type === 'count'){
      return await UserModel.find({
        users_type: {$in : ['Freelancer','Sales Person', 'Retailer','Promoter']},
        status : "A",
        ...condition
      }).countDocuments();
    } else if(type === 'single'){
      const result = await UserModel.aggregate(pipeline);
      if(result.length > 0){
        return result[0];
      } else {
        return {};
      }
    } else{
      return await UserModel.aggregate(pipeline);
    }
  } catch (error) {
    return Promise.reject(error);
  }
}