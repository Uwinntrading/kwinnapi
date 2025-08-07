const counter = require("../../../../../../../models/counter");
const response         = require("../../../../../../../util/response");
const utility          = require('../../../../../../../util/utility');
const Services         = require("../../../../../../services/admin/v1/cms/BannerServices");
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

        const { page_name } = req.body;
        let slider_image; 
        if(req.file?.fieldname === 'image'){
            slider_image        = await imageHandler.upload_img(req.file,'banner');
        }
        const counter = await counterService.getSequence('kw_banner');
        const options = {
            section_id    : counter.seq,  
            slider_image  : slider_image,
            page_name     : page_name,
            status        : "A",
            created_ip    : utility.loginIP(req),
            created_by    : utility.AdminUserID(req),
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
         const { page_name , id ,status } = req.body;

         // Image uploading section start here
         let slider_image ='';
         if(req?.file?.fieldname === 'image'){
            let SelectWhere = {
                type : 'single',
                condition : {
                    _id :  utility.stringToObjectId(id),
                },
                select : {
                    slider_image : true
                }
            }
            const result   = await Services.select(SelectWhere);
            const oldImage = result?.slider_image;
            if(oldImage){
                await imageHandler.delete_img(oldImage);
            }
            slider_image   = await imageHandler.upload_img(req.file,'banner');

         }
         // Image uploading section end here
         const options = {
             condition : { 
                 _id  : id ,
             },
             data : {
                 ...( page_name     ? { page_name : page_name } : ''),
                 ...( slider_image  ? { slider_image : slider_image } : ''),
                 ...( status        ? { status  : status } : ''),
                 updated_ip         : utility.loginIP(req),
                 updated_by         : utility.AdminUserID(req)
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
                slider_image : true ,
            }
        }
        const result    = await Services.select(SelectWhere);
        const oldImage  = result.slider_image;
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