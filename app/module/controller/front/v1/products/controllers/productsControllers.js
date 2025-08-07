const response = require("../../../../../../util/response");
const {isValidObjectId} = require('../../../../../../util/valueChecker');
const productService = require('../../../../../services/front/v1/productServices');
const settingServices = require('../../../../../services/front/v1/settingServices');
const path = require('path');
/*********************************************************************************
 * Function Name    :   list
 * Purpose          :   This function is used to product list 
 * Created By       :   Afsar Ali
 * Created Data     :   29 October 2024
 * Updated By       :   
 * Update Data      :
 * Remarks          :
 **********************************************************************************/
exports.list = async function (req, res) {
    try {  
        const { type='',select={},condition={},sort={}, page = 1 } = req.body;
        
        const limit = 10; 
        const skip = (page - 1) * limit; 

        const options = {
            type : type,
            ...(select?{select:select}:null),
            condition : {
                ...condition,
                status : "A"
            },
            sort : sort,
            skip : skip,
            limit : limit
        }
        const ourCampaigns = await productService.selectWithPopulate(options);
        let result = {
            page : page,
            ourCampaigns : ourCampaigns,
            totalPage : 1
        }
        if(type === 'single' || type === 'count'){
            return response.sendResponse(res, response.build('SUCCESS', { result : result}));
        }else if(ourCampaigns.length > 0){
            const countOption = {
                type : 'count',
                condition : {
                    ...condition,
                    status : "A"
                }
            }
            const totalCount = await productService.select(countOption);
            result.totalPage = Math.ceil(totalCount / 10);
            return response.sendResponse(res, response.build('SUCCESS', { result : result}));
        }else{
            return response.sendResponse(res, response.build('SUCCESS', { result : {}}));
        }
    } catch(error){
        // console.log('error',error);
        return response.sendResponse(res, response.build('ERROR_SERVER_ERROR', { error }));
    }
}

/*********************************************************************************
 * Function Name    :   list
 * Purpose          :   This function is used to product list 
 * Created By       :   Afsar Ali
 * Created Data     :   29 October 2024
 * Updated By       :   
 * Update Data      :
 * Remarks          :
 **********************************************************************************/
exports.setting = async function (req, res) {
    try {  
        const options = { condition : { status : "A" } }
        const result = await settingServices.select(options);
        return response.sendResponse(res, response.build('SUCCESS', { result : result}));
    } catch(error){
        // console.log('error',error);
        return response.sendResponse(res, response.build('ERROR_SERVER_ERROR', { error }));
    }
}