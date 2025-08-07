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
        
        // console.log(req.files)
        // return response.sendResponse(res, response.build('SUCCESS', {  }));


        let sectionArray = [];  
        let image = '';
        const Arraycount = JSON.parse(title).length;
        for (let index = 0; index < Arraycount; index++) {
            image  = req.files[`photo${index}`];
            // console.log(image);

            let img ="";
            if(image != '' ){
                img  = await imageHandler.img_upload_array(image,'test');
                // console.log(img)
            }
            let data = {
                title : JSON.parse(title)[index],
                description : JSON.parse(description)[index],
                image : img
            }
            sectionArray.push(data);
        }
      
        const counter = await counterService.getSequence('kw_cms');
        const options = {
            section_id   : counter.seq,  
            sections     : sectionArray,
            page_name    : page_name,
            status       : "A",
            where_to_play: where_to_play,
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
        const { title , description , where_to_play , page_name, id ,status } = req.body;
        
        let SelectWhere = {
            type : 'single',
            condition : {
                _id : id,
            },
            select : {
                sections : true ,
            }
        }
        const DataExist  = await Services.select(SelectWhere);
        
        let image        = '';
        let sectionArray = [];  
        const Arraycount = JSON.parse(title).length;
        
        // Image uploading section start here
        for (let index = 0; index < Arraycount; index++) {
            image  = req.files[`photo${index}`];
            let existing_img;
            if(DataExist.sections[index]?.image !='' && DataExist.sections[index]?.image !== undefined ){
                existing_img =  DataExist.sections[index].image;
            }
            
            let img ="";
            if(image !== '' && image !== undefined ){
                img  = await imageHandler.img_upload_array(image,'test');
            }else{
                img  = existing_img;
            }
            let data = {
                title : JSON.parse(title)[index],
                description : JSON.parse(description)[index],
                image : img
            }
            sectionArray.push(data);
        }

        // Image uploading section end here
        const options = {
             condition : { 
                 _id  : id ,
             },
             data : {
                ...(sectionArray ? { sections: sectionArray } : ''),
                ...(page_name ? { page_name: page_name } : ''),
                ...(where_to_play ? { where_to_play: where_to_play } : ''),
                ...(status ? { status: status } : ''),
                updated_ip  : utility.loginIP(req),
                updated_by  : utility.AdminUserID(req)
             }
        }
        // console.log(options)
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