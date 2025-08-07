const counter = require("../../../../../../models/counter");
const response         = require("../../../../../../util/response");
const utility          = require('../../../../../../util/utility');
const Services         = require("../../../../../services/admin/v1/products/ProductServices");
const counterService   = require('../../../../../services/counterService');
const imageHandler     = require("../../../../../../util/imageHandler");

 /*********************************************************************************
 * Function Name    :   Add
 * Purposs          :   This function is used to add data
 * Created By       :   Dilip Halder
 * Created Data     :   28 October 2024
 **********************************************************************************/
exports.add = async function (req, res) {

    try {  
         const { 
            product_image_alt, title, title_slug, description, category_id, category_name, 
            sub_category_id, sub_category_name, straight_add_on_amount, rumble_add_on_amount, 
            reverse_add_on_amount, commingSoon, countdown_status, validuptodate, validuptotime, 
            lotto_type, is_show_closing, draw_date, draw_time, seq_order, ticket_number_repeat, 
            enable_number_prefix, lotto_range_prefix, lotto_range_start, lotto_range_end 
        } = req.body;

        let product_image   ='';
        let game_logo       ='';
        if(req?.files?.product_image?.length > 0 && req.files.product_image[0].fieldname == 'product_image'){
            console.log('img1')
            product_image = await imageHandler.upload_img(req.files.product_image[0],'products');
        } 

        if(req?.files?.game_logo?.length > 0 && req.files.game_logo[0].fieldname == 'game_logo'){
            console.log('img2')
            game_logo = await imageHandler.upload_img(req.files.game_logo[0],'products');
        }

 
        const counter = await counterService.getSequence('kw_products');
        const options = {
            products_id: counter.seq,
            product_image : product_image,
            game_logo     : game_logo,
            product_image_alt: product_image_alt,
            title: title,
            title_slug: title_slug,
            description: description,
            category_id: category_id,
            category_name: category_name,
            sub_category_id: sub_category_id,
            sub_category_name: sub_category_name,
            straight_add_on_amount: straight_add_on_amount,
            rumble_add_on_amount: rumble_add_on_amount,
            reverse_add_on_amount: reverse_add_on_amount,
            commingSoon: commingSoon,
            countdown_status: countdown_status,
            validuptodate: validuptodate,
            validuptotime: validuptotime,
            lotto_type: lotto_type,
            is_show_closing: is_show_closing,
            draw_date: draw_date,
            draw_time: draw_time,
            seq_order: seq_order,
            ticket_number_repeat: ticket_number_repeat,
            enable_number_prefix: enable_number_prefix,
            lotto_range_prefix: lotto_range_prefix,
            lotto_range_start: lotto_range_start,
            lotto_range_end: lotto_range_end
        };
 
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
            product_image_alt, title, description, category_id, category_name, 
            sub_category_id, sub_category_name, straight_add_on_amount, rumble_add_on_amount, 
            reverse_add_on_amount, commingSoon, countdown_status, validuptodate, validuptotime, 
            lotto_type, is_show_closing, draw_date, draw_time, seq_order, ticket_number_repeat, 
            enable_number_prefix, lotto_range_prefix, lotto_range_start, lotto_range_end , id ,status,
            //game setting variables
            straight_game_name ,rumble_game_name , chance_game_name , straight_settings , rumble_settings , chance_settings, straight_settings_default_check,
            rumble_settings_default_check , chance_settings_default_check , campaign_auto_freezing_mode , campaign_freezing_start_time , campaign_freezing_end_time ,
             game_description

        } = req.body;
        
        // Image uploading section start here
        let product_image   ='';
        let game_logo       ='';
        let game_rule_image ='';
        if(req?.files?.product_image?.length > 0 && req.files.product_image[0].fieldname == 'product_image'){
            console.log('img1')
            product_image = await imageHandler.upload_img(req.files.product_image[0],'products');
        } 

        if(req?.files?.game_logo?.length > 0 && req.files.game_logo[0].fieldname == 'game_logo'){
            console.log('img2')
            game_logo = await imageHandler.upload_img(req.files.game_logo[0],'products');
        }

        if(req?.files?.game_rule_image?.length > 0 && req.files.game_rule_image[0].fieldname == 'game_rule_image'){
            console.log('img2')
            game_rule_image = await imageHandler.upload_img(req.files.game_rule_image[0],'products');
        }
        
        let SelectWhere = {
            type : 'single',
            condition : {
                _id : id,
            },
            select : {
                product_image   : true ,
                game_logo       :true,
            }
        }
        const result            = await Services.select(SelectWhere);
        const oldProductImage   = result?.product_image;
        const oldGameLogo       = result?.game_logo;
        
        // Image uploading section end here
        const options = {
             condition : { 
                 _id  : id ,
             },
             data : {
                 ...(status ? { status  : status } : ''),
                 ...(product_image  ? { product_image  : product_image } :  ''),
                 ...(game_logo  ? { game_logo  : game_logo } :  ''),
                 ...(product_image_alt  ? { product_image_alt  :  product_image_alt } : ''),
                 ...(title  ? { title      :  title } : ''),
                 ...(title  ? { title_slug : utility.createSlug(title) } : ''),
                 ...(description  ? { description : description } : ''),
                 ...(category_id  ? { category_id : category_id } : ''),
                 ...(category_name  ? { category_name : category_name } : ''),
                 ...(sub_category_id  ? { sub_category_id : sub_category_id } : ''),
                 ...(sub_category_name  ? { sub_category_name : sub_category_name } : ''),
                 ...(straight_add_on_amount  ? { straight_add_on_amount : straight_add_on_amount } : ''),
                 ...(rumble_add_on_amount  ? { rumble_add_on_amount : rumble_add_on_amount } : ''),
                 ...(reverse_add_on_amount  ? { reverse_add_on_amount : reverse_add_on_amount } : ''),
                 ...(commingSoon  ? { commingSoon : commingSoon } : ''),
                 ...(countdown_status  ? { countdown_status : countdown_status } : ''),
                 ...(validuptodate  ? { validuptodate : validuptodate } : ''),
                 ...(validuptotime  ? { validuptotime : validuptotime } : ''),
                 ...(lotto_type  ? { lotto_type : lotto_type } : ''),
                 ...(is_show_closing  ? { is_show_closing : is_show_closing } : ''),
                 ...(draw_date  ? { draw_date : draw_date } : ''),
                 ...(draw_time  ? { draw_time : draw_time } : ''),
                 ...(seq_order  ? { seq_order : seq_order } : ''),
                 ...(ticket_number_repeat   ? { ticket_number_repeat : ticket_number_repeat } : ''),
                 ...(enable_number_prefix   ? { enable_number_prefix : enable_number_prefix } : ''),
                 ...(lotto_range_prefix     ? { lotto_range_prefix   : lotto_range_prefix } : ''),
                 ...(lotto_range_start      ? { lotto_range_start    : lotto_range_start } : ''),
                 ...(lotto_range_end        ? { lotto_range_end      : lotto_range_end } : ''),
                 
                 ...(straight_game_name  ? { straight_game_name  : straight_game_name } : ''),
                 ...(rumble_game_name    ? { rumble_game_name    : rumble_game_name } : ''),
                 ...(chance_game_name    ? { chance_game_name    : chance_game_name } : ''),
                 ...(straight_settings   ? { straight_settings   : straight_settings } : ''),
                 ...(rumble_settings     ? { rumble_settings     : rumble_settings } : ''),
                 ...(chance_settings     ? { chance_settings     : chance_settings } : ''),
                 ...(straight_settings_default_check    ? { straight_settings_default_check  : straight_settings_default_check } : ''),
                 ...(rumble_settings_default_check      ? { rumble_settings_default_check    : rumble_settings_default_check } : ''),
                 ...(chance_settings_default_check      ? { chance_settings_default_check    : chance_settings_default_check } : ''),
                 ...(campaign_auto_freezing_mode        ? { campaign_auto_freezing_mode      : campaign_auto_freezing_mode } : ''),
                 ...(campaign_freezing_start_time       ? { campaign_freezing_start_time     : campaign_freezing_start_time } : ''),
                 ...(campaign_freezing_end_time         ? { campaign_freezing_end_time       : campaign_freezing_end_time } : ''),
                 ...(game_description                   ? { game_description                 : game_description } : ''),
                 ...(game_rule_image                    ? { game_rule_image                  : game_rule_image } : ''),
                 ...(status                             ? { status : status } : ''),
                 updated_ip          : utility.loginIP(req),
                 updated_by          : utility.AdminUserID(req),
             }

            }
            console.log(options)

         const UpdatedResponse = await Services.updateData(options);
         if(UpdatedResponse){
            if(product_image){
                await imageHandler.delete_img(oldProductImage);
            }

            if(game_logo){
                await imageHandler.delete_img(oldGameLogo);
            }
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
        const oldCategoryImage1 =  result.game_logo;
        if(oldCategoryImage){
            await imageHandler.delete_img(oldCategoryImage)
        }

        if(oldCategoryImage1){
            await imageHandler.delete_img(oldCategoryImage1)
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
