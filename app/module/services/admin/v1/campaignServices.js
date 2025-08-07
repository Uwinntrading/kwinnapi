const campaignModel = require("../../../../models/kw_campaigns");
const campaignDraws = require("../../../../models/kw_campaign_draws");
/**********************************************************************
 * Function Name    :   select
 * Purpose          :   This function is used for select from campaigns table
 * Created By       :   Afsar Ali
 * Created Data     :   08-01-2025
 * Updated By       :   
 * Update Data      :
 * Remarks          : 
 **********************************************************************/
exports.select = async function (options) {
    try {
      const { type, condition={}, select={}, sort={}, skip, limit } = options;
      if(type === 'count'){
        return await campaignModel.countDocuments(condition);
      } else if(type === 'single'){
        return await campaignModel.findOne(condition).select(select);
      } else {
        return await campaignModel.find(condition).select(select).sort(sort).skip(skip).limit(limit);
      }
    } catch (error) {
      return Promise.reject(error);
    }
}//End of Function

/**********************************************************************
 * Function Name    :   createData
 * Purpose          :   This function is used for insert into campaign 
 * Created By       :   Afsar Ali
 * Created Data     :   08-01-2025
 * Updated By       :   
 * Update Data      :
 * Remarks          : 
 **********************************************************************/
exports.createData = async function (options) {
  try {
      return await campaignModel.create(options);
  } catch (error) {
    return Promise.reject(error);
  }
}//End of Function

/**********************************************************************
 * Function Name    :   updateData
 * Purpose          :   This function is used for update campaign 
 * Created By       :   Afsar Ali
 * Created Data     :   08-01-2025
 * Updated By       :   
 * Update Data      :
 * Remarks          : 
 **********************************************************************/
exports.updateData = async function (options) {
  try {
    const {condition, data} = options;
      return await campaignModel.findOneAndUpdate(condition, data, {new :true});
  } catch (error) {
    return Promise.reject(error);
  }
}//End of Function

/**********************************************************************
 * Function Name    :   getCampaignById
 * Purpose          :   This function is used for get campaign data by Id
 * Created By       :   Afsar Ali
 * Created Data     :   08-01-2025
 * Updated By       :   
 * Update Data      :
 * Remarks          : 
 **********************************************************************/
exports.getCampaignById = async function (options) {
  try {
      return await campaignModel.findById(options)
  } catch (error) {
    return Promise.reject(error);
  }
}//End of Function


/**********************************************************************
 * Function Name    :   select_draw
 * Purpose          :   This function is used for select from campaigns draw table
 * Created By       :   Afsar Ali
 * Created Data     :   09-01-2025
 * Updated By       :   
 * Update Data      :
 * Remarks          : 
 **********************************************************************/
exports.select_draw = async function (options) {
  try {
    const { type, condition={}, select={}, sort={}, skip, limit } = options;
    if(type === 'count'){
      return await campaignDraws.countDocuments(condition);
    } else if(type === 'single'){
      return await campaignDraws.findOne(condition).select(select);
    } else {
      return await campaignDraws.find(condition).select(select).sort(sort).skip(skip).limit(limit);
    }
  } catch (error) {
    return Promise.reject(error);
  }
}//End of Function

/**********************************************************************
* Function Name    :   createDrawData
* Purpose          :   This function is used for insert into campaign draw 
* Created By       :   Afsar Ali
* Created Data     :   09-01-2025
* Updated By       :   
* Update Data      :
* Remarks          : 
**********************************************************************/
exports.createDrawData = async function (options) {
try {
    return await campaignDraws.create(options);
} catch (error) {
  return Promise.reject(error);
}
}//End of Function

/**********************************************************************
* Function Name    :   updateDrawData
* Purpose          :   This function is used for update campaign draw 
* Created By       :   Afsar Ali
* Created Data     :   09-01-2025
* Updated By       :   
* Update Data      :
* Remarks          : 
**********************************************************************/
exports.updateDrawData = async function (options) {
try {
  const {condition, data} = options;
    return await campaignDraws.updateMany(condition, data, {new :true});
} catch (error) {
  return Promise.reject(error);
}
}//End of Function

/**********************************************************************
* Function Name    :   getDrawById
* Purpose          :   This function is used for get campaign draw data by Id
* Created By       :   Afsar Ali
* Created Data     :   09-01-2025
* Updated By       :   
* Update Data      :
* Remarks          : 
**********************************************************************/
exports.getDrawById = async function (options) {
try {
    return await campaignDraws.findById(options)
} catch (error) {
  return Promise.reject(error);
}
}//End of Function