const counter = require("../../../../../../../models/counter");
const response         = require("../../../../../../../util/response");
const utility          = require('../../../../../../../util/utility');
const Services         = require("../../../../../../services/admin/v1/cms/PlayServices");
const counterService   = require('../../../../../../services/counterService');
const imageHandler     = require("../../../../../../../util/imageHandler");
 
 /*********************************************************************************
 * Function Name    :   Add
 * Purposs          :   This function is used to add data
 * Created By       :   Dilip Halder
 * Created Data     :   23 October 2024
 **********************************************************************************/
exports.add = async function (req, res) {

    try { 
        //  Destructure the request body
        const{ title , description , where_to_play , page_name } = req.body;
        
        console.log(req.body);
        return response.sendResponse(res, response.build('SUCCESS', { result: req.body }));


        let sectionArray = [];

        for (let index = 0; index < title?.length; index++) {
            const img = await imageHandler.upload_img(req.files[index],'test')
            const data = {
                title : title[index],
                description : description[index],
            }
            sectionArray.push(data);
        }
        const counter = await counterService.getSequence('kw_cms');
        const options = {
            section_id   : counter.seq,  
            sections     : sectionArray,
            page_name    : page_name,
            description  : where_to_play,
            status       : "A",
            created_ip   : utility.loginIP(req),
            created_by   : utility.AdminUserID(req),
        }
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
 * Created Data     :   23 October 2024
 **********************************************************************************/
exports.update = async function (req, res) {
    try {  

        //  Destructure the request body
        const {  
            alt_text, email_id, contact_no, address, facebook_link, linkedin_link, twitter_link, 
            insta_link, you_tube, slider_type, whatsapp_no, whatsapp_authorization_key , android_version , 
            ios_version , draw_time_start , draw_time_end , app_url , delivery_charge , drawdata_pin , comming_soon_pro_btn , 
            comming_soon_text , home_botttom_slider_header , prize_title ,choose_coupon, enable_u_points_in_pos , id ,status 
        } = req.body;

         // Image uploading section start here
         let logo =''; 
         if(req?.file?.fieldname === 'image'){
            let SelectWhere = {
                type : 'single',
                condition : {
                    _id :  utility.stringToObjectId(id),
                },
                select : {
                    logo : true
                }
            }
            const result   = await Services.select(SelectWhere);
            const oldImage = result?.logo;
            if(oldImage){
                await imageHandler.delete_img(oldImage);
            }

            logo = await imageHandler.upload_img(req.file,'cms');

         }
         // Image uploading section end here
         const options = {
             condition : { 
                 _id  : id ,
             },
             data : {
                ...(alt_text ? { alt_text: alt_text } : ''),
                ...(email_id ? { email_id: email_id } : ''),
                ...(contact_no ? { contact_no: contact_no } : ''),
                ...(address ? { address: address } : ''),
                ...(facebook_link ? { facebook_link: facebook_link } : ''),
                ...(linkedin_link ? { linkedin_link: linkedin_link } : ''),
                ...(twitter_link ? { twitter_link: twitter_link } : ''),
                ...(insta_link ? { insta_link: insta_link } : ''),
                ...(you_tube ? { you_tube: you_tube } : ''),
                ...(slider_type ? { slider_type: slider_type } : ''),
                ...(whatsapp_no ? { whatsapp_no: whatsapp_no } : ''),
                ...(android_version ? { android_version: android_version } : ''),
                ...(ios_version ? { ios_version: ios_version } : ''),
                ...(logo ? { logo: logo } : ''),
                ...(choose_coupon ? { choose_coupon: choose_coupon } : ''),
                ...(whatsapp_authorization_key ? { whatsapp_authorization_key: whatsapp_authorization_key } : ''),
                ...(app_url ? { app_url: app_url } : ''),
                ...(draw_time_end ? { draw_time_end: draw_time_end } : ''),
                ...(draw_time_start ? { draw_time_start: draw_time_start } : ''),
                ...(delivery_charge ? { delivery_charge: delivery_charge } : ''),
                ...(drawdata_pin ? { drawdata_pin: drawdata_pin } : ''),
                ...(comming_soon_pro_btn ? { comming_soon_pro_btn: comming_soon_pro_btn } : ''),
                ...(comming_soon_text ? { comming_soon_text: comming_soon_text } : ''),
                ...(home_botttom_slider_header ? { home_botttom_slider_header: home_botttom_slider_header } : ''),
                ...(prize_title ? { prize_title: prize_title } : ''),
                ...(enable_u_points_in_pos ? { enable_u_points_in_pos: enable_u_points_in_pos } : ''),
                ...(status ? { status: status } : ''),
                updated_ip  : utility.loginIP(req),
                updated_by  : utility.AdminUserID(req)
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
 * Created Data     :   23 October 2024
 **********************************************************************************/
exports.delete = async function (req, res) {
    try {
        const { id }    = req.body
        let SelectWhere = {
            type : 'single',
            condition : {
                _id : id,
            },
            select : {
                logo : true ,
            }
        }
        const result    = await Services.select(SelectWhere);
        const oldImage  = result.logo;
        if(oldImage){
            await imageHandler.delete_img(oldImage)
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
 * Created Data     :   23 October 2024
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