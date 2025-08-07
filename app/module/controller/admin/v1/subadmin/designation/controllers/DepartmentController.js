const counter = require("../../../../../../../models/counter");
const response         = require("../../../../../../../util/response");
const utility          = require('../../../../../../../util/utility');
const Services         = require("../../../../../../services/admin/v1/subadmin/DepartmentServices");
const counterService   = require('../../../../../../services/counterService');

 /*********************************************************************************
 * Function Name    :   Add
 * Purposs          :   This function is used to add department
 * Created By       :   Dilip Halder
 * Created Data     :   21 October 2024
 **********************************************************************************/
exports.add = async function (req, res) {

    try {  
        // Destructure the request body
        const { adminoId , department_name } = req.body;
        const counter = await counterService.getSequence('uw_admin_departments')
        const options = {
            department_id   : counter.seq,  
            department_name : department_name,
            department_slug : utility.createSlug(department_name),
            department_used : "N",
            status          : "A",
            created_ip      : utility.loginIP(req),
            created_by      : adminoId
        }

        // console.log(options)
        const result =  await Services.create(options);
        if(result){
            return response.sendResponse(res, response.build('SUCCESS', { result: result }));
        } 
        // // Send the success response
    } catch (error) {
        if (error.code === 11000) {
            return response.sendResponse(res, response.build('ERROR_DUPLICATE_DEPARTMENT', {
                error: 'Department name already exists',
                details: error.message
            }));
        }
        // Log any other errors and send a generic server error response
        console.log('error', error);
        return response.sendResponse(res, response.build('ERROR_SERVER_ERROR', { error }));
    }
};
 
/*********************************************************************************
 * Function Name    :   UpdatePassword
 * Purposs          :   This function is used update data
 * Created By       :   Dilip Halder
 * Created Data     :   23 October 2024
 **********************************************************************************/
 exports.update = async function (req, res) {
    try {  
        // Destructure the request body
        const { uid , id , department_name , department_used , status } = req.body;
        console.log('error', req.body);

        const options = {
                condition : { 
                    _id  : id ,
                },
                data : {
                        ...department_name ? { department_name  : department_name }      : '',
                        ...department_used ? { department_used  : department_used }      : '',
                        ...status          ? { status  : status }                        : '',
                        ...uid             ? { updated_by  : uid }                       : '',
                    }
        }

        const UpdatedResponse = await Services.updateData(options);
        if(UpdatedResponse){
            return response.sendResponse(res, response.build('SUCCESSFULLY_UPDATED',{ result :[]} ));
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