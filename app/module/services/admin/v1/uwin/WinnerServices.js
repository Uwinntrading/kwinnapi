const CollectionTable = require('../../../../../models/kw_winners');
/**********************************************************************
 * Function Name    :   select
 * Purposs          :   This function is used to get user data by condition.
 * Created By       :   Dilip Halder
 * Created Data     :   15-October-2024
 **********************************************************************/
exports.select = async function (options) {
    try {
      const { type, condition={}, select, sort, skip, limit ,filters={} } = options;
      if(type === 'count'){
        // return await Services.find(condition).count();
        return await CollectionTable.countDocuments(condition);
      } else if(type === 'single'){
        return await CollectionTable.findOne(condition).select(select).populate([
          {
            path   : "redeem_by",
            model  : "kw_users",
            select : "users_name last_name pos_number store_name bind_user_type bind_person_name users_mobile",
          }
        ]);
      } else {
        return await CollectionTable.find(condition).select(select).populate([
          {
            path   : "redeem_by",
            model  : "kw_users",
            select : "users_name last_name pos_number store_name bind_user_type bind_person_name users_mobile",
          }
        ]).sort(sort).skip(skip).limit(limit);
      }
    } catch (error) {
      return Promise.reject(error);
    }
}//End of Function

/**********************************************************************
 * Function Name    :   create
 * Purposs          :   This function is used for create order archive
 * Created By       :   Dilip Halder
 * Created Data     :   21-OCTOBER-2024
 **********************************************************************/
exports.create = async (options) => {
    try {
        return await CollectionTable.insertMany(options);
    } catch (error) {
        return Promise.reject(error);
    }
  };//End of Function

/**********************************************************************
 * Function Name    :   updateData
 * Purposs          :   This function is used for update Admin
 * Created By       :   Dilip Halder
 * Created Data     :   15-October-2024
 **********************************************************************/
exports.updateData = async function (options) {
  try {
    const {condition, data} = options;
    return await CollectionTable.findByIdAndUpdate(condition, data, {new: true})
  } catch (error) {
    return Promise.reject(error);
  }
}//End of Function

/**********************************************************************
 * Function Name    :   updateData
 * Purposs          :   This function is used for update Admin
 * Created By       :   Dilip Halder
 * Created Data     :   15-October-2024
 **********************************************************************/
exports.updateByConditionData = async function (options) {
  try {
    const {condition, data} = options;
    return await CollectionTable.updateMany(condition, data, {new: true})
  } catch (error) {
    return Promise.reject(error);
  }
}//End of Function

/**********************************************************************
 * Function Name    :   updateData
 * Purposs          :   This function is used for update Admin
 * Created By       :   Dilip Halder
 * Created Data     :   15-October-2024
 **********************************************************************/
exports.deleteData = async function (options) {
  try {
    return await CollectionTable.deleteMany(options)
  } catch (error) {
    return Promise.reject(error);
  }
}//End of Function



/**********************************************************************
 * Function Name    :   winnerList
 * Purpose          :   This function is used for get lotto winners data
 * Created By       :   Dilip Halder
 * Created Data     :   12-02-2025
 **********************************************************************/
exports.winnerList = async function (options) {
  try {
    const {condition={}, skip=0, limit=10, type=''} = options;
      const pipeline = [
        {
          $match  : { 
            ...(condition && condition.createdAt && { createdAt : {"$gte" : new Date(condition.createdAt)}  }), 
            ...(condition && condition.file && { file : condition.file  }), 
            ...(condition && condition.batch_id && { batch_id : parseInt(condition.batch_id)  }), 
            ...(condition && condition.order_no && { status : condition.order_no  }), 
            ...(condition && condition.status && { status : condition.status  })
          } 
        },
        {
          ...(type === 'count' ? {
            $group: {
              _id: "$batch_id", 
              orderCount: { $sum: 1 }
            }
          }:{
            $group: {
              _id: "$batch_id", 
              orderCount: { $sum: 1 },
              activeCount: { $sum: { $cond: [{ $eq: ["$status", "Active"] }, 1, 0] } }, 
              inactiveCount: { $sum: { $cond: [{ $eq: ["$status", "Inactive"] }, 1, 0] } },
              redeemedCount: { $sum: { $cond: [{ $eq: ["$status", "Redeemed"] }, 1, 0] } }, 

              total_points: { $sum: "$winning_amount" },
              redeemedPoints: { $sum: { $cond: [{ $eq: ["$status", "Redeemed"] }, "$winning_amount", 0] } }, // Canceled Points
              redeemedPoints: { $sum: { $cond: [{ $eq: ["$status", "Redeemed"] }, "$winning_amount", 0] } }, // Canceled Points

              created_date: { $max: "$createdAt" },
              batch_id : { $max: "$batch_id" },
              file : {$max: "$file"}
            }
          }),
        },
        {
        ...(type === 'count' ? { 
          $project: {
            batch_id: "$batch_id",
            orderCount : 1,
            _id: 0 
          }
         } : {
            $project: {
              batch_id: 1, 
              orderCount: 1,
              activeCount: 1,
              inactiveCount: 1,
              redeemedCount: 1,
              total_points : 1,
              redeemedPoints : 1,
              created_date : 1,
              file : 1,
              _id: 0 
            }
         }),
        },
        {
          $sort: { batch_id: -1 } 
        }
      ];
      if (type !== 'count') {
        if (skip) pipeline.push({ $skip: skip });
        if (limit) pipeline.push({ $limit: limit });
      }
      const result = await CollectionTable.aggregate(pipeline);
      if (type === 'count') {
        return result.length > 0 ? result.length : 0; 
      } else if (type === 'single'){
        return result.length > 0 ? result[0]:{}; 
      } else {
        return result;
      }
  } catch (error) {
    console.log('error',error);
    return Promise.reject(error);
  }
}//End of Function