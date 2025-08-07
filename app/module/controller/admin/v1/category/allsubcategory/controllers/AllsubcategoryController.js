const counter = require("../../../../../../../models/counter");
const response         = require("../../../../../../../util/response");
const utility          = require('../../../../../../../util/utility');
const Services         = require("../../../../../../services/admin/v1/category/SubCategoryServices");
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
       
        const { category_id , category_name ,  sub_category , sub_cat_image_alt } = req.body;
        let sub_cat_image ;
        if(req.file?.fieldname === 'image'){
            sub_cat_image        = await imageHandler.upload_img(req.file,'subcategory');
        }
        const counter = await counterService.getSequence('kw_sub_categories');
        const options = {
            category_id         : category_id ,
            category_name       : category_name,
            category_slug       : utility.createSlug(category_name),
            sub_category_id     : counter.seq,
            sub_category        : sub_category,
            sub_category_slug   : utility.createSlug(sub_category),
            sub_cat_image       : sub_cat_image,
            sub_cat_image_alt   : sub_cat_image_alt,
            created_ip          : utility.loginIP(req),
            created_by          : utility.AdminUserID(req),
            status              : "A"
            
        }
        const result =  await Services.create(options);
        if(result){
            return response.sendResponse(res, response.build('SUCCESS', { result: result }));
        }

         
    } catch (error) {
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
        // Destructure the request body
        const { category_id , category_name ,category_slug , sub_category ,sub_cat_image_alt , id ,status} = req.body;

        // Image uploading section start here
            let sub_cat_image = '';
            if(req?.file?.fieldname === 'image'){

                let SelectWhere = {
                    type : 'single',
                    condition : {
                        id : id,
                    },
                    select : {
                        sub_cat_image : true ,
                    }
                }
                // console.log('SelectWSelectWherehere',SelectWhere);
                const result            = await Services.select(SelectWhere);
                const oldSubCategoryImage  = result?.sub_cat_image;
                if(oldSubCategoryImage){
                    await imageHandler.delete_img(oldSubCategoryImage);
                }
                sub_cat_image   = await imageHandler.upload_img(req.file,'subcategory');

                
            }
        // Image uploading section end here

        const options = {
            condition : { 
                _id  : id ,
            },
            data : {
                ...(category_id    ? { category_id          : category_id      } : ''),
                ...(category_name  ? { category_name        : category_name    } : ''),
                ...(category_slug  ? { category_slug        : category_slug    } : ''),
                ...(sub_category   ? { sub_category         : sub_category } : ''),
                ...(sub_category   ? { sub_category_slug    :  utility.createSlug(sub_category) } : ''),
                ...(sub_cat_image  ? { sub_cat_image        : sub_cat_image } : ''),
                ...(sub_cat_image_alt ? { sub_cat_image_alt : sub_cat_image_alt } : ''),
                ...(status ? { status  : status } : ''),
                updated_ip          : utility.loginIP(req),
                updated_by          : utility.AdminUserID(req),
            }
        }
        const UpdatedResponse = await Services.updateData(options);
        if(UpdatedResponse){
            return response.sendResponse(res, response.build('SUCCESSFULLY_UPDATED',{ result : UpdatedResponse } ));
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
        let SelectWhere = {
            type : 'single',
            condition : {
                _id : id,
            },
            select : {
                sub_cat_image : true ,
            }
        }
        const result            = await Services.select(SelectWhere);
        const oldCategoryImage  =  result.sub_cat_image;
        
        await imageHandler.delete_img(oldCategoryImage)
        
        const options      = { _id  : id }
        const UpdatedResponse = await Services.deleteData(options);
        if(UpdatedResponse){
            return response.sendResponse(res, response.build('SUCCESSFULLY_DELETED',{ result :[]} ));
        }
        

    } catch (error) {
        // Catch any errors and log them, then send an error response
        console.log('error', error);
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
 
