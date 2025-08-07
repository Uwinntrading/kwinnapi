const counter = require("../../../../../../models/counter");
const response         = require("../../../../../../util/response");
const utility          = require('../../../../../../util/utility');
const counterService   = require('../../../../../services/counterService');
const imageHandler     = require("../../../../../../util/imageHandler");
const Services         = require("../../../../../services/admin/v1/orders/OrderServices");
const Services12         = require("../../../../../services/admin/v1/orders/TicketServices");
const Services1         = require("../../../../../services/front/v1/campaignOrderServices");

 
 /*********************************************************************************
 * Function Name    :   Add
 * Purposs          :   This function is used to add data
 * Created By       :   Dilip Halder
 * Created Data     :   23 October 2024
 **********************************************************************************/
exports.add = async function (req, res) {

    try {  
        const { category_name ,category_image_alt } = req.body;
        let category_image; 
        if(req.file?.fieldname === 'image'){
            category_image        = await imageHandler.upload_img(req.file,'category');
        }

        const counter = await counterService.getSequence('kw_category');
        const options = {
            category_id         : counter.seq,  
            category_name       : category_name,
            category_slug       : utility.createSlug(category_name),
            category_image      : category_image,
            category_image_alt  : category_image_alt,
            created_ip          : utility.loginIP(req),
            created_by          : utility.AdminUserID(req),
            status              : "A"
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
         const { id ,status } = req.body;
         const options = {
             condition : { 
                 _id  : id ,
             },
             data : {
                 ...(status ? { status  : status } : ''),
                 updated_ip          : utility.loginIP(req),
                 updated_by          : utility.AdminUserID(req),
             }
         }
         const OrderResponce = await Services.updateData(options);
         
        //  return response.sendResponse(res, response.build('SUCCESSFULLY_UPDATED',{ result :OrderResponce} ));
         let UpdatedResponse = {};
         if(OrderResponce != ''){
            const options1 = {
                condition : { 
                    order_id  : id ,
                },
                data : {
                    ...(status ? { status  : status } : ''),
                    updated_ip          : utility.loginIP(req),
                    updated_by          : utility.AdminUserID(req),
                }
            }
            UpdatedResponse = await Services12.updateManyData(options1);
         }

         if(UpdatedResponse){
             return response.sendResponse(res, response.build('SUCCESSFULLY_UPDATED',{ result :OrderResponce} ));
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
        const { id } = req.body
        console.log(req.body)

        let SelectWhere = {
            type : 'single',
            condition : {
                _id : id,
            },
            select : {
                category_image : true ,
            }
        }
        const result            = await Services.select(SelectWhere);
        const oldCategoryImage  =  result.category_image;
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
 * Function Name  :  list
 * Purposs        :  This function is used to add data
 * Created By     :  Dilip Halder
 * Created Data   :  21 January 2025
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
        const result = await Services1.select_details(listWhere);
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
    