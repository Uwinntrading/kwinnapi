const counter = require("../../../../../../models/counter");
const response         = require("../../../../../../util/response");
const utility          = require('../../../../../../util/utility');
const Services         = require("../../../../../services/admin/v1/products/PrizeServices");
const counterService   = require('../../../../../services/counterService');
const imageHandler     = require("../../../../../../util/imageHandler");
const productServices  = require("../../../../../services/admin/v1/products/ProductServices");

 /*********************************************************************************
 * Function Name    :   Add
 * Purposs          :   This function is used to add data
 * Created By       :   Dilip Halder
 * Created Data     :   28 October 2024
 **********************************************************************************/
exports.add = async function (req, res) {

    try {  
        const { 
            enable_title,title,description,
            enable_stright_prize_heading,stright_prize_heading ,stright_prize_type, 
            stright_prize1 ,stright_prize2,stright_prize3,stright_prize4,stright_prize5,stright_prize6,stright_prize7,
            enable_rumble_mix_prize_heading , rumble_mix_prize_heading , rumble_mix_prize_type , 
            rumble_mix_prize1 , rumble_mix_prize2 , rumble_mix_prize3 , rumble_mix_prize4 ,rumble_mix_prize5 , rumble_mix_prize6 , rumble_mix_prize7,
            enable_reverse_prize_heading,reverse_prize_heading,reverse_prize_type, 
            reverse_prize1, reverse_prize2 ,reverse_prize3 ,reverse_prize4 ,reverse_prize5 ,reverse_prize6 , reverse_prize7 ,
            lotto_type , prize_image_alt , status ,prize_id, p_oid,
        } = req.body;

        let prize_image = '';
        if(req.file?.fieldname === 'image'){
            prize_image   = await imageHandler.upload_img(req.file,'prizes');
        }
 
        const counter = await counterService.getSequence('kw_prize');
        const options = {
            prize_id: counter.seq,
            enable_title: enable_title,
            title: title,
            title_slug: utility.createSlug(title),
            description: description,
            enable_stright_prize_heading: enable_stright_prize_heading,
            stright_prize_heading: stright_prize_heading,
            stright_prize_type: JSON.parse(stright_prize_type),
            ...(stright_prize_type    ? { stright_prize_type     : JSON.parse(stright_prize_type) } : ''),
            stright_prize1: stright_prize1,
            stright_prize2: stright_prize2,
            stright_prize3: stright_prize3,
            stright_prize4: stright_prize4,
            stright_prize5: stright_prize5,
            stright_prize6: stright_prize6,
            stright_prize7: stright_prize7,
            enable_rumble_mix_prize_heading: enable_rumble_mix_prize_heading,
            rumble_mix_prize_heading: rumble_mix_prize_heading,
            ...(rumble_mix_prize_type    ? { rumble_mix_prize_type     : JSON.parse(rumble_mix_prize_type) } : ''),
            rumble_mix_prize1: rumble_mix_prize1,
            rumble_mix_prize2: rumble_mix_prize2,
            rumble_mix_prize3: rumble_mix_prize3,
            rumble_mix_prize4: rumble_mix_prize4,
            rumble_mix_prize5: rumble_mix_prize5,
            rumble_mix_prize6: rumble_mix_prize6,
            rumble_mix_prize7: rumble_mix_prize7,
            enable_reverse_prize_heading: enable_reverse_prize_heading,
            reverse_prize_heading: reverse_prize_heading,
            ...(reverse_prize_type    ? { reverse_prize_type     : JSON.parse(reverse_prize_type) } : ''),
            reverse_prize1: reverse_prize1,
            reverse_prize2: reverse_prize2,
            reverse_prize3: reverse_prize3,
            reverse_prize4: reverse_prize4,
            reverse_prize5: reverse_prize5,
            reverse_prize6: reverse_prize6,
            reverse_prize7: reverse_prize7,
            lotto_type: lotto_type,
            prize_image: prize_image,
            prize_image_alt: prize_image_alt,
            status: status,
            p_oid: p_oid
        };

        const result =  await Services.create(options);
        if(result){
            const updateOption = {
                condition : { _id : p_oid },
                data : { prize_data : result._id }
            }
            productServices.updateData(updateOption);
            return response.sendResponse(res, response.build('SUCCESS', { result: result }));
        }
        
    } catch (error) {
        console.log(error)
        if (error.code === 11000) {
            return response.sendResponse(res, response.build('ERROR_DUPLICATE_DEPARTMENT', {
                error: 'Prize is already exists.',
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
            enable_title,title,description,
            enable_stright_prize_heading,stright_prize_heading ,stright_prize_type, 
            stright_prize1 ,stright_prize2,stright_prize3,stright_prize4,stright_prize5,stright_prize6,stright_prize7,
            enable_rumble_mix_prize_heading , rumble_mix_prize_heading , rumble_mix_prize_type , 
            rumble_mix_prize1 , rumble_mix_prize2 , rumble_mix_prize3 , rumble_mix_prize4 ,rumble_mix_prize5 , rumble_mix_prize6 , rumble_mix_prize7,
            enable_reverse_prize_heading,reverse_prize_heading,reverse_prize_type, 
            reverse_prize1, reverse_prize2 ,reverse_prize3 ,reverse_prize4 ,reverse_prize5 ,reverse_prize6 , reverse_prize7 ,
            lotto_type , prize_image_alt , status ,prize_id, p_oid,id

        } = req.body;

         // Image uploading section start here
         let prize_image   ='';
         if(req?.file?.fieldname === 'image'){
            
             let SelectWhere = {
                 type : 'single',
                 condition : {
                     _id : id,
                 },
                 select : {
                     prize_image : true 
                 }
             }
             const result            = await Services.select(SelectWhere);
             const oldPrizeImage  =  result?.prize_image;
             if(oldPrizeImage){
                await imageHandler.delete_img(oldPrizeImage);
             } 
             prize_image  = await imageHandler.upload_img(req.file,'products');
         }
         // Image uploading section end here
         const options = {
             condition : { 
                 _id  : id ,
             },
             data : {
                ...(enable_title ? { enable_title  : enable_title } : ''),
                ...(title ? { title  : title } : ''),
                ...(title ? { title_slug  : utility.createSlug(title) } : ''),
                ...(description ? { description  : description } : ''),
               
                ...(enable_stright_prize_heading ? { enable_stright_prize_heading  : enable_stright_prize_heading } : ''),
                ...(stright_prize_heading ? { stright_prize_heading  : stright_prize_heading } : ''),
                ...(stright_prize_type    ? { stright_prize_type     : JSON.parse(stright_prize_type) } : ''),
                ...(stright_prize1        ? { stright_prize1         : stright_prize1 } : ''),
                ...(stright_prize2        ? { stright_prize2         : stright_prize2 } : ''),
                ...(stright_prize3        ? { stright_prize3         : stright_prize3 } : ''),
                ...(stright_prize4        ? { stright_prize4         : stright_prize4 } : ''),
                ...(stright_prize5        ? { stright_prize5         : stright_prize5 } : ''),
                ...(stright_prize6        ? { stright_prize6         : stright_prize6 } : ''),
                ...(stright_prize7        ? { stright_prize7         : stright_prize7 } : ''),

                ...(enable_rumble_mix_prize_heading   ? { enable_rumble_mix_prize_heading : enable_rumble_mix_prize_heading } : ''),
                ...(rumble_mix_prize_heading          ? { rumble_mix_prize_heading : rumble_mix_prize_heading } : ''),
                ...(rumble_mix_prize_type             ? { rumble_mix_prize_type :  JSON.parse(rumble_mix_prize_type) } : ''),
                ...(rumble_mix_prize1                 ? { rumble_mix_prize1 : rumble_mix_prize1 } : ''),
                ...(rumble_mix_prize2                 ? { rumble_mix_prize2 : rumble_mix_prize2 } : ''),
                ...(rumble_mix_prize3                 ? { rumble_mix_prize3 : rumble_mix_prize3 } : ''),
                ...(rumble_mix_prize4                 ? { rumble_mix_prize4 : rumble_mix_prize4 } : ''),
                ...(rumble_mix_prize5                 ? { rumble_mix_prize5 : rumble_mix_prize5 } : ''),
                ...(rumble_mix_prize6                 ? { rumble_mix_prize6 : rumble_mix_prize6 } : ''),
                ...(rumble_mix_prize7                 ? { rumble_mix_prize7 : rumble_mix_prize7 } : ''),

                ...(enable_reverse_prize_heading       ? { enable_reverse_prize_heading : enable_reverse_prize_heading } : ''),
                ...(reverse_prize_heading              ? { reverse_prize_heading : reverse_prize_heading } : ''),
                ...(reverse_prize_type                 ? { reverse_prize_type :  JSON.parse(reverse_prize_type) } : ''),
                ...(reverse_prize1   ? { reverse_prize1 : reverse_prize1 } : ''),
                ...(reverse_prize2   ? { reverse_prize2 : reverse_prize2 } : ''),
                ...(reverse_prize3   ? { reverse_prize3 : reverse_prize3 } : ''),
                ...(reverse_prize4   ? { reverse_prize4 : reverse_prize4 } : ''),
                ...(reverse_prize5   ? { reverse_prize5 : reverse_prize5 } : ''),
                ...(reverse_prize6   ? { reverse_prize6 : reverse_prize6 } : ''),
                ...(reverse_prize7   ? { reverse_prize7 : reverse_prize7 } : ''),
                ...(lotto_type   ? { lotto_type : lotto_type } : ''),
                ...(prize_image  ? { prize_image:prize_image } : ''),
                ...(prize_image_alt   ? { prize_image_alt : prize_image_alt } : ''),
                ...(status            ? { status : status } : ''),
                ...(p_oid             ? {p_oid : p_oid} : ''),
                updated_ip          : utility.loginIP(req),
                updated_by          : utility.AdminUserID(req),
             }

         }

         const UpdatedResponse = await Services.updateData(options);
         if(UpdatedResponse){
            const updateOption = {
                condition : { _id : p_oid },
                data : { prize_data : UpdatedResponse._id }
            }
            productServices.updateData(updateOption);
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
                prize_image : true ,
            }
        }
        const result         = await Services.select(SelectWhere);
        const oldPrizeImage  =  result.prize_image;
        if(oldPrizeImage){
            await imageHandler.delete_img(oldPrizeImage)
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
