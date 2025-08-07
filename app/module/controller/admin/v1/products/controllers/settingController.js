const counter = require("../../../../../../models/counter");
const response = require("../../../../../../util/response");
const utility = require('../../../../../../util/utility');
const Services = require("../../../../../services/admin/v1/products/SettingServices");
const counterService = require('../../../../../services/counterService');
const imageHandler = require("../../../../../../util/imageHandler");
const kw_settings = require("../../../../../../models/kw_settings");


 /*********************************************************************************
 * Function Name    :   Add
 * Purposs          :   This function is used to add data
 * Created By       :   Dilip Halder
 * Created Data     :   28 October 2024
 **********************************************************************************/
exports.add = async function (req, res) {

    try {  
         const { straight_game_name ,rumble_game_name , chance_game_name , straight_settings , rumble_settings , chance_settings, straight_settings_default_check,
            rumble_settings_default_check , chance_settings_default_check , campaign_auto_freezing_mode , campaign_freezing_start_time , campaign_freezing_end_time ,
             game_description
           } = req.body;

        let game_rule_image = '';
        if(req.file?.fieldname === 'image'){
            game_rule_image   = await imageHandler.upload_img(req.file,'products');
        }
        
        const counter = await counterService.getSequence('kw_products');
        const options = {
            seq_id                          : counter.seq,
            straight_game_name              : straight_game_name ,
            rumble_game_name                : rumble_game_name ,
            chance_game_name                : chance_game_name ,
            straight_settings               : straight_settings ,
            rumble_settings                 : rumble_settings ,
            chance_settings                 : chance_settings ,
            straight_settings_default_check : straight_settings_default_check ,
            rumble_settings_default_check   : rumble_settings_default_check ,
            chance_settings_default_check   : chance_settings_default_check ,
            campaign_auto_freezing_mode     : campaign_auto_freezing_mode ,
            campaign_freezing_start_time    : campaign_freezing_start_time ,
            campaign_freezing_end_time      : campaign_freezing_end_time ,
            game_description                : game_description ,
            status                          : "A" ,
            game_rule_image                 : game_rule_image
        };
        
        console.log(options)
        const result =  await Services.create(options);
        if(result){
            return response.sendResponse(res, response.build('SUCCESS', { result: result }));
        } 
        
    } catch (error) {
        console.log(error)
        if (error.code === 11000) {
            return response.sendResponse(res, response.build('ERROR_DUPLICATE_DEPARTMENT', {
                error: 'Category name already exists',
                details: error.message
            }));
        }
        // Log any other errors and send a generic server error response
        // console.log('error', error);
        return response.sendResponse(res, response.build('ERROR_SERVER_ERROR', { error }));
    }
};

/*********************************************************************************
 * Function Name    :   Update
 * Purposs          :   This function is used update data
 * Created By       :   Dilip Halder
 * Created Data     :   28 October 2024
 **********************************************************************************/
exports.update = async function (req, res) {
    try {  

        //  Destructure the request body
        const { 
            straight_game_name ,rumble_game_name , chance_game_name , straight_settings , rumble_settings , chance_settings, straight_settings_default_check,
            rumble_settings_default_check , chance_settings_default_check , campaign_auto_freezing_mode , campaign_freezing_start_time , campaign_freezing_end_time ,
             game_description , status ,id
        } = req.body;
         // Image uploading section start here
         let game_rule_image ='';
         if(req?.file?.fieldname === 'image'){
            
             let SelectWhere = {
                 type : 'single',
                 condition : {
                     _id : id,
                 },
                 select : {
                     game_rule_image : true ,
                 }
             }
             const result            = await Services.select(SelectWhere);
             const oldCategoryImage  =  result?.game_rule_image;
             if(oldCategoryImage){
                await imageHandler.delete_img(oldCategoryImage);
             }
            game_rule_image   = await imageHandler.upload_img(req.file,'products');
         }
         // Image uploading section end here
         const options = {
             condition : { 
                 _id  : id ,
             },
             data : {
                ...(status ? { status: status } : ''),
                ...(straight_game_name  ? { straight_game_name: straight_game_name } : ''),
                ...(rumble_game_name    ? { rumble_game_name: rumble_game_name } : ''),
                ...(chance_game_name    ? { chance_game_name: chance_game_name } : ''),
                ...(straight_settings   ? { straight_settings: straight_settings } : ''),
                ...(rumble_settings     ? { rumble_settings: rumble_settings } : ''),
                ...(chance_settings     ? { chance_settings: chance_settings } : ''),
                ...(straight_settings_default_check ? { straight_settings_default_check: straight_settings_default_check } : ''),
                ...(rumble_settings_default_check   ? { rumble_settings_default_check: rumble_settings_default_check } : ''),
                ...(chance_settings_default_check   ? { chance_settings_default_check: chance_settings_default_check } : ''),
                ...(campaign_auto_freezing_mode     ? { campaign_auto_freezing_mode: campaign_auto_freezing_mode } : ''),
                ...(campaign_freezing_start_time    ? { campaign_freezing_start_time: campaign_freezing_start_time } : ''),
                ...(campaign_freezing_end_time      ? { campaign_freezing_end_time: campaign_freezing_end_time } : ''),
                ...(game_description                ? { game_description: game_description } : ''),
                ...(game_rule_image                 ? { game_rule_image: game_rule_image } : ''),
                updated_ip: utility.loginIP(req),
                updated_by: utility.AdminUserID(req),
             }
         }
         const UpdatedResponse = await Services.updateData(options);
         if(UpdatedResponse){
             return response.sendResponse(res, response.build('SUCCESSFULLY_UPDATED',{ result :UpdatedResponse} ));
         }else{
             return response.sendResponse(res, response.build('ERROR_DATA_NOT_FOUND',{ result :[]} ));
         }

    } catch (error) {
        // Catch any errors and log them, then send an error response
        console.log('error', error);
        return response.sendResponse(res, response.build('ERROR_SERVER_ERROR', { error }));
    }
};
 
/*********************************************************************************
 * Function Name    :   delete
 * Purposs          :   This function is used to delete data
 * Created By       :   Dilip Halder
 * Created Data     :   28 October 2024
 **********************************************************************************/
exports.delete = async function (req, res) {
    try {
        const { id } = req.body
        console.log(req.body)

        let SelectWhere = {
            type : 'single',
            condition : {
                _id : id,
            },
            select : {
                product_image : true ,
            }
        }
        const result            = await Services.select(SelectWhere);
        const oldCategoryImage  =  result.product_image;
        if(oldCategoryImage){
            await imageHandler.delete_img(oldCategoryImage)
        }
        const options      = { _id  : id }
        const UpdatedResponse = await Services.deleteData(options);
        if(UpdatedResponse){
            return response.sendResponse(res, response.build('SUCCESSFULLY_DELETED',{ result :[]} ));
        }
    } catch (error) {
        // Catch any errors and log them, then send an error response
        return response.sendResponse(res, response.build('ERROR_SERVER_ERROR', { error }));
    }
} 


 /*********************************************************************************
 * Function Name    :   list
 * Purposs          :   This function is used to add data
 * Created By       :   Dilip Halder
 * Created Data     :   28 October 2024
 **********************************************************************************/
 exports.list = async function (req, res) {
    try {
        const { condition={}, select ={}, sort={}, type, skip, limit }=req.body;

        let listWhere = {
            ...(condition? {condition : { ...condition }}:null),
            ...(sort? {sort : sort}:null),
            ...(select? {select : select}:null),
            ...(type?{type:type}:null),
            ...(skip?{skip:skip}:null),
            ...(limit?{limit:limit}:{limit : 10}),
        }


        const result = await Services.select(listWhere);
        
        if(type == "count" && result == "" ){
            return response.sendResponse(res, response.build('SUCCESS',{ result : 0 } ));
        }else if(result != ''){
            return response.sendResponse(res, response.build('SUCCESS',{ result :result } ));
        }else{
            return response.sendResponse(res, response.build('ERROR_DATA_NOT_FOUND',{ result :[]} ));
        } 
        
    } catch (error) {
        console.log('error',error)
        return response.sendResponse(res, response.build('ERROR_SERVER_ERROR', { error }));
    }
}; //End of Function
