const lottoWinnerModel = require('../../../../models/kw_winners');
/**********************************************************************
 * Function Name    :   select
 * Purpose          :   This function is used for select from lotto winners table
 * Created By       :   Afsar Ali
 * Created Data     :   16-01-2025
 * Updated By       :   
 * Update Data      :
 **********************************************************************/
exports.select = async function (options) {
    try {
      const { type, condition={}, select={}, sort={}, skip, limit } = options;
      if(type === 'count'){
        return await lottoWinnerModel.countDocuments(condition);
      } else if(type === 'single'){
        return await lottoWinnerModel.findOne(condition).select(select);
      } else {
        return await lottoWinnerModel.find(condition).select(select).sort(sort).skip(skip).limit(limit);
      }
    } catch (error) {
      return Promise.reject(error);
    }
}//End of Function

/**********************************************************************
 * Function Name    :   createData
 * Purpose          :   This function is used for insert into lotto winners 
 * Created By       :   Afsar Ali
 * Created Data     :   16-01-2025
 * Updated By       :   
 * Update Data      :
 **********************************************************************/
exports.createData = async function (options) {
  try {
      return await lottoWinnerModel.insertMany(options);
  } catch (error) {
    return Promise.reject(error);
  }
}//End of Function

/**********************************************************************
 * Function Name    :   updateData
 * Purpose          :   This function is used for update lotto winners 
 * Created By       :   Afsar Ali
 * Created Data     :   16-01-2025
 * Updated By       :   
 * Update Data      :
 **********************************************************************/
exports.updateData = async function (options) {
  try {
    const {condition, data} = options;
      return await lottoWinnerModel.findOneAndUpdate(condition, data, {new :true});
  } catch (error) {
    return Promise.reject(error);
  }
}//End of Function

/**********************************************************************
 * Function Name    :   updateManyData
 * Purpose          :   This function is used for update lotto winners 
 * Created By       :   Afsar Ali
 * Created Data     :   21-01-2025
 * Updated By       :   
 * Update Data      :
 **********************************************************************/
exports.updateManyData = async function (options) {
  try {
    const {condition, data} = options;
      return await lottoWinnerModel.updateMany(condition, data, {new :true});
  } catch (error) {
    return Promise.reject(error);
  }
}//End of Function

/**********************************************************************
 * Function Name    :   deleteData
 * Purpose          :   This function is used for delete lotto winners 
 * Created By       :   Afsar Ali
 * Created Data     :   16-01-2025
 * Updated By       :   
 * Update Data      :
 **********************************************************************/
exports.deleteData = async function (options) {
    try {
        return await lottoWinnerModel.findByIdAndDelete(options);
    } catch (error) {
      return Promise.reject(error);
    }
  }//End of Function

/**********************************************************************
 * Function Name    :   deleteData
 * Purpose          :   This function is used for delete lotto winners 
 * Created By       :   Afsar Ali
 * Created Data     :   21-01-2025
 * Updated By       :   
 * Update Data      :
 **********************************************************************/
exports.deleteManyData = async function (options) {
  try {
      return await lottoWinnerModel.deleteMany(options);
  } catch (error) {
    return Promise.reject(error);
  }
}//End of Function


/**********************************************************************
 * Function Name    :   getDataById
 * Purpose          :   This function is used for get lotto winners data by Id
 * Created By       :   Afsar Ali
 * Created Data     :   16-01-2025
 * Updated By       :   
 * Update Data      :
 **********************************************************************/
exports.getDataById = async function (options) {
  try {
      return await lottoWinnerModel.findById(options)
  } catch (error) {
    return Promise.reject(error);
  }
}//End of Function

/**********************************************************************
 * Function Name    :   summeryList
 * Purpose          :   This function is used for get lotto winners data
 * Created By       :   Afsar Ali
 * Created Data     :   20-01-2025
 * Updated By       :   
 * Update Data      :
 **********************************************************************/
exports.summeryList = async function (options) {
  try {
    const {condition={}, skip=0, limit=10, type=''} = options;
      const pipeline = [
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
      const result = await lottoWinnerModel.aggregate(pipeline);
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