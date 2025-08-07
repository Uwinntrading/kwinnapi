const generalData = require('../../../../models/kw_general_data');
const favoriteCountry = require('../../../../models/kw_favorite_countries');
/**********************************************************************
 * Function Name    :   select
 * Purpose          :   This function is used for select from general data table
 * Created By       :   Afsar Ali
 * Created Data     :   08-NOV-2024
 * Updated By       :   
 * Update Data      :
 * Remarks          : 
 **********************************************************************/
exports.select = async function (options) {
    try {
      const { type, condition={}, select={}, sort={}, skip, limit } = options;
      if(type === 'count'){
        return await generalData.countDocuments(condition);
      } else if(type === 'single'){
        return await generalData.findOne(condition).select(select);
      } else {
        return await generalData.find(condition).select(select).sort(sort).skip(skip).limit(limit);
      }
    } catch (error) {
      return Promise.reject(error);
    }
}//End of Function

/**********************************************************************
 * Function Name    :   select_fav_country
 * Purpose          :   This function is used for select from favorite country
 * Created By       :   Afsar Ali
 * Created Data     :   03-01-2025
 * Updated By       :   
 * Update Data      :
 * Remarks          : 
 **********************************************************************/
exports.select_fav_country = async function (options) {
  try {
    const { type, condition={}, select={}, sort={}, skip, limit } = options;
    if(type === 'count'){
      return await favoriteCountry.countDocuments(condition);
    } else if(type === 'single'){
      return await favoriteCountry.findOne(condition).select(select);
    } else {
      return await favoriteCountry.find(condition).select(select).sort(sort).skip(skip).limit(limit);
    }
  } catch (error) {
    return Promise.reject(error);
  }
}//End of Function

/**********************************************************************
 * Function Name    :   create_fav_country
 * Purpose          :   This function is used for insert in to favorite country
 * Created By       :   Afsar Ali
 * Created Data     :   03-01-2025
 * Updated By       :   
 * Update Data      :
 * Remarks          : 
 **********************************************************************/
exports.create_fav_country = async function (options) {
  try {
     return await favoriteCountry.create(options);
  } catch (error) {
    return Promise.reject(error);
  }
}//End of Function

/**********************************************************************
 * Function Name    :   delete_fav_country
 * Purpose          :   This function is used for insert in to favorite country
 * Created By       :   Afsar Ali
 * Created Data     :   03-01-2025
 * Updated By       :   
 * Update Data      :
 * Remarks          : 
 **********************************************************************/
exports.delete_fav_country = async function (options) {
  try {
     return await favoriteCountry.deleteOne(options);
  } catch (error) {
    return Promise.reject(error);
  }
}//End of Function
