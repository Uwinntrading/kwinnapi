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
 * Purpose          :   This function is used for insert into prize 
 * Created By       :   Afsar Ali
 * Created Data     :   09-01-2025
 * Updated By       :   
 * Update Data      :
 * Remarks          : 
 **********************************************************************/
exports.createData = async function (options) {
  try {
      return await lottoWinnerModel.create(options);
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
