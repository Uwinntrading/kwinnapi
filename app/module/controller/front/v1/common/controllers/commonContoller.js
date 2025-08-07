const response            = require("../../../../../../util/response");
const { isValidObjectId } = require("../../../../../../util/valueChecker");
const commonServices      = require("../../../../../services/front/v1/commonServices");
const generalDataServices = require("../../../../../../module/services/front/v1/commonServices");
const ContentServices     = require("../../../../../services/admin/v1/uwin/ContentServices");
const moment              = require('moment');

/*********************************************************************************
 * Function Name    :   getCountryCode
 * Purpose          :   This function is used for get country code
 * Created By       :   Afsar Ali
 * Created Data     :   23-10-2024
 * Updated By       :   
 * Update Data      :
 * Remarks          :
 ********************************************************************************/
exports.getCountryCode = async function (req, res) {
  try {
      const result = require('../../../../../../util/country_code.json');
      return response.sendResponse(res, response.build('SUCCESS', { result }));
  } catch (error) {
      console.log('error',error)
      return response.sendResponse(res, response.build('ERROR_SERVER_ERROR', { error }));
  }
}; //End of Function

/*********************************************************************************
 * Function Name    :   countryAddToFavorite
 * Purpose          :   This function is used for country add to favorite
 * Created By       :   Afsar Ali
 * Created Data     :   03-01-2025
 * Updated By       :   
 * Update Data      :
 ********************************************************************************/
exports.countryAddToFavorite = async function (req, res) {
  try {
    const userId = req.user.userId;
    const { country_name } = req.body;
    if(!country_name){
      return response.sendResponse(res, response.build('COUNTRY_NAME_EMPTY', { }));
    } else {
      const param = {
        name : country_name,
        created_by : userId
      }
      const result = await commonServices.create_fav_country(param);
      return response.sendResponse(res, response.build('SUCCESS', { result }));
    }
  } catch (error) {
      console.log('error',error)
      return response.sendResponse(res, response.build('ERROR_SERVER_ERROR', { error }));
  }
}; //End of Function
/*********************************************************************************
 * Function Name    :   countryRemoveToFavorite
 * Purpose          :   This function is used for country remove to favorite
 * Created By       :   Afsar Ali
 * Created Data     :   03-01-2025
 * Updated By       :   
 * Update Data      :
 ********************************************************************************/
exports.countryRemoveToFavorite = async function (req, res) {
  try {
    const userId = req.user.userId;
    const { id } = req.body;
    if(!isValidObjectId(id)){
      return response.sendResponse(res, response.build('ERROR_DATA_NOT_FOUND', { }));
    } else {
      const param = { _id : id }
      const result = await commonServices.delete_fav_country(param);
      return response.sendResponse(res, response.build('SUCCESS', { }));
    }
  } catch (error) {
      console.log('error',error)
      return response.sendResponse(res, response.build('ERROR_SERVER_ERROR', { error }));
  }
}; //End of Function

/*********************************************************************************
 * Function Name    :   countryFavoriteList
 * Purpose          :   This function is used for country favorite list
 * Created By       :   Afsar Ali
 * Created Data     :   03-01-2025
 * Updated By       :   
 * Update Data      :
 ********************************************************************************/
exports.countryFavoriteList = async function (req, res) {
  try {
    const userId = req.user.userId;
    const options ={
      condition : { created_by : userId },
      sort : { name : -1 }
    }
    const result = await commonServices.select_fav_country(options);
    return response.sendResponse(res, response.build('SUCCESS', { result }));  
  } catch (error) {
      console.log('error',error)
      return response.sendResponse(res, response.build('ERROR_SERVER_ERROR', { error }));
  }
}; //End of Function

/*********************************************************************************
 * Function Name    :   getAllProvider
 * Purpose          :   This function is used to product get all provider
 * Created By       :   Dilip Halder
 * Created Data     :   07-01-2025
 **********************************************************************************/
exports.generalInfo = async function (req, res) {
  try {
      const { condition = {}, select = {}, sort = {}, type, skip, limit } = req.body;
      let listWhere = {
          ...(condition ? { condition: { ...condition } } : null),
          ...(sort ? { sort: sort } : null),
          ...(select ? { select: select } : null),
          ...(type ? { type: type } : null),
          ...(skip ? { skip: skip } : null),
          ...(limit ? { limit: limit } : { limit: 10 }),
      }
      const result = await generalDataServices.select(listWhere);
      const current_time = `${moment().format('YYYY-MM-DD HH:mm')}`
      if (type == "count" && result == "") {
          return response.sendResponse(res, response.build('SUCCESS', { result: 0 }));
      } else if (result != '') {
          return response.sendResponse(res, response.build('SUCCESS', { result: result,current_time:current_time }));
      } else {
          return response.sendResponse(res, response.build('ERROR_DATA_NOT_FOUND', { result: [] }));
      }

  } catch (error) {
      console.log('error', error)
      return response.sendResponse(res, response.build('ERROR_SERVER_ERROR', { error }));
  }
}; //End of Function

/*********************************************************************************
 * Function Name    :   pagebanner
 * Purpose          :   This function is used for pagebanner list
 * Created By       :   Dilip Halder
 * Created Data     :   10-02-2025
 * Updated By       :   
 * Update Data      :
 ********************************************************************************/
exports.pagebanner = async function (req, res) {
  try {
    console.log(req.body)

    const {  added_for_top_banner ,added_for_recent_winners , added_for_result_page ,added_for_winner_gallery } = req.body

    const options = {
      condition : { 
        
        ...(added_for_top_banner       ? {added_for_top_banner:added_for_top_banner}:[]),
        ...(added_for_recent_winners   ? {added_for_recent_winners:added_for_top_banner}:[]),
        ...(added_for_recent_winners   ? {added_for_recent_winners:added_for_recent_winners}:[]),
        ...(added_for_result_page      ? {added_for_result_page:added_for_result_page}:[]),
        ...(added_for_winner_gallery   ? {added_for_winner_gallery:added_for_winner_gallery}:[]),
        status : 'A' 
      },
      sort : { _id : -1 }
    }

    const result = await ContentServices.select(options);

    return response.sendResponse(res, response.build('SUCCESS', { result }));  
  } catch (error) {
      console.log('error',error)
      return response.sendResponse(res, response.build('ERROR_SERVER_ERROR', { error }));
  }
}; //End of Function