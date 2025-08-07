const counter = require("../../../../../../../models/counter");
const response = require("../../../../../../../util/response");
const utility = require('../../../../../../../util/utility');
const Services = require("../../../../../../services/admin/v1/uwin/ContentServices");
const counterService = require('../../../../../../services/counterService');
const imageHandler   = require("../../../../../../../util/imageHandler");

/*********************************************************************************
* Function Name    :   Add
* Purposs          :   This function is used to add data
* Created By       :   Dilip Halder
* Created Data     :   23 October 2024
**********************************************************************************/
exports.add = async function (req, res) {

    try {
        const { 
            added_for_top_banner , added_for_recent_winners , added_for_result_page , added_for_winner_gallery,
            upload_type , 
            // image , video , ,
            link_url , link_title , game_type ,  
         } = req.body;

        let image , video , link_thumbnail;
        if(req.files?.image && req.files?.image[0].fieldname === 'image'){
            image = await imageHandler.upload_img(req.files.image[0],'content');
        }
        if(req.files?.video && req.files?.video[0].fieldname === 'video'){
            video = await imageHandler.upload_img(req.files.video[0],'content');
        }

        if(req.files?.link_thumbnail && req.files?.link_thumbnail[0].fieldname === 'link_thumbnail'){
            link_thumbnail = await imageHandler.upload_img(req.files.link_thumbnail,'content');
        }

        const counter = await counterService.getSequence('kw_content');
        const options = {
            seq_id                   : counter.seq,
            upload_type              : upload_type,
            added_for_top_banner     : added_for_top_banner?JSON.parse(added_for_top_banner):[],
            added_for_recent_winners : added_for_recent_winners?JSON.parse(added_for_recent_winners):[],
            added_for_result_page    : added_for_result_page?JSON.parse(added_for_result_page):[],
            added_for_winner_gallery : added_for_winner_gallery?added_for_winner_gallery:[],
            ...(image?{image:image}:''),
            ...(video?{video:video}:''),
            ...(link_url?{link_url:link_url}:''),
            ...(link_title?{link_title:link_title}:''),
            ...(link_thumbnail?{link_thumbnail:link_thumbnail}:''),
            status                    : "A",
            created_ip                : utility.loginIP(req),
            created_by                : utility.AdminUserID(req),
        }


        const result = await Services.create(options);
        if (result) {
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
        const {  id, status, added_for_top_banner , added_for_recent_winners , added_for_result_page , added_for_winner_gallery,
            upload_type , 
            // image , video , ,
            link_url , link_title , game_type ,   } = req.body;
        
        let existingData;
        if(id){
            let SelectWhere = {
                type : 'single',
                condition : {
                    _id :  utility.stringToObjectId(id),
                },
                select : {
                    image : true,
                    video : true,
                    link_thumbnail : true,
                }
            }
            existingData   = await Services.select(SelectWhere);
        }
        console.log(existingData)


        // Image uploading section end here
        let image , video , link_thumbnail;
        if(req.files?.image && req.files?.image[0].fieldname === 'image'){
            image = await imageHandler.upload_img(req.files.image[0],'content');
            const oldImage = existingData?.image;
            if(oldImage){
                await imageHandler.delete_img(oldImage);
            }
        }
        if(req.files?.video && req.files?.video[0].fieldname === 'video'){
            video = await imageHandler.upload_img(req.files.video[0],'content');
            const oldvideo = existingData?.image;
            if(oldvideo){
                await imageHandler.delete_img(oldvideo);
            }
        }

        if(req.files?.link_thumbnail && req.files?.link_thumbnail[0].fieldname === 'link_thumbnail'){
            link_thumbnail = await imageHandler.upload_img(req.files.link_thumbnail,'content');
            const oldlink_thumbnail = existingData?.link_thumbnail;
            if(oldlink_thumbnail){
                await imageHandler.delete_img(oldlink_thumbnail);
            }
        }

        const options = {
            condition: {
                _id: id
            },
            data: {
                ...(added_for_top_banner        ? { added_for_top_banner      : JSON.parse(added_for_top_banner) }     : []),
                ...(added_for_recent_winners    ? { added_for_recent_winners  : JSON.parse(added_for_recent_winners) } : []),
                ...(added_for_result_page       ? { added_for_result_page     : JSON.parse(added_for_result_page) }    : []),
                ...(added_for_winner_gallery    ? { added_for_winner_gallery  : JSON.parse(added_for_winner_gallery) } : []),
                ...(upload_type                 ? { upload_type  : upload_type } : ''),
                ...(link_url                    ? { link_url  : link_url }       : ''),
                ...(link_title                  ? { link_title  : link_title }   : ''),
                ...(game_type                   ? { game_type  : game_type }     : ''),
                ...(image                       ? { image  : image }             : ''),
                ...(video                       ? { video  : video }             : ''),
                ...(link_thumbnail              ? { link_thumbnail  : link_thumbnail } : ''),
                ...(status ? { status: status } : ''),
                updated_ip: utility.loginIP(req),
                updated_by: utility.AdminUserID(req)
            }
        }


        
        const UpdatedResponse = await Services.updateData(options);
        if (UpdatedResponse) {
            return response.sendResponse(res, response.build('SUCCESSFULLY_UPDATED', { result: UpdatedResponse }));
        } else {
            return response.sendResponse(res, response.build('ERROR_DATA_NOT_FOUND', { result: [] }));
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
        const { id } = req.body

        let SelectWhere = {
            type : 'single',
            condition : {
                _id :  utility.stringToObjectId(id),
            },
            select : {
                image : true,
                video : true,
                link_thumbnail : true,
            }
        }
        let existingData   = await Services.select(SelectWhere);
        // Image uploading section end here
        if(existingData?.image){
            const oldImage = existingData?.image;
            await imageHandler.delete_img(oldImage);
        }

        if(existingData?.video){
            const oldvideo = existingData?.video;
            await imageHandler.delete_img(oldvideo);
        }

        if(existingData?.link_thumbnail){
            const oldlink_thumbnail = existingData?.link_thumbnail;
            await imageHandler.delete_img(oldlink_thumbnail);
        }
       
        const options = { _id: id }
        const UpdatedResponse = await Services.deleteData(options);
        if (UpdatedResponse) {
            return response.sendResponse(res, response.build('SUCCESSFULLY_DELETED', { result: [] }));
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
        const { condition = {}, select = {}, sort = {}, type, skip, limit } = req.body;

        let listWhere = {
            ...(condition ? { condition: { ...condition } } : null),
            ...(sort ? { sort: sort } : null),
            ...(select ? { select: select } : null),
            ...(type ? { type: type } : null),
            ...(skip ? { skip: skip } : null),
            ...(limit ? { limit: limit } : { limit: 10 }),

        }
        const result = await Services.select(listWhere);
        if (type == "count" && result == "") {
            return response.sendResponse(res, response.build('SUCCESS', { result: 0 }));
        } else if (result != '') {
            return response.sendResponse(res, response.build('SUCCESS', { result: result }));
        } else {
            return response.sendResponse(res, response.build('ERROR_DATA_NOT_FOUND', { result: [] }));
        }

    } catch (error) {
        console.log('error', error)
        return response.sendResponse(res, response.build('ERROR_SERVER_ERROR', { error }));
    }
}; //End of Function