const counter = require("../../../../../../../models/counter");
const response = require("../../../../../../../util/response");
const utility = require('../../../../../../../util/utility');
const Services = require("../../../../../../services/admin/v1/cms/uwinPermissionServices");
const counterService = require('../../../../../../services/counterService');

/*********************************************************************************
* Function Name    :   Add
* Purposs          :   This function is used to add data
* Created By       :   Dilip Halder
* Created Data     :   23 October 2024
**********************************************************************************/
exports.add = async function (req, res) {

    try {
        const { uwin_permission, uwin_allowd_user_type } = req.body;
        const counter = await counterService.getSequence('uw_uwin_allowed_user');
        const options = {
            section_id             : counter.seq,
            uwin_permission        : uwin_permission,
            uwin_allowd_user_type  : uwin_allowd_user_type,
            status                 : "A",
            created_ip             : utility.loginIP(req),
            created_by             : utility.AdminUserID(req),
        }

        console.log(req.body);

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
 * Function Name    :   update
 * Purposs          :   This function is used update data
 * Created By       :   Dilip Halder
 * Created Data     :   23 October 2024
 **********************************************************************************/
exports.update = async function (req, res) {
    try {
        //  Destructure the request body
        const {  id , status , uwin_permission , uwin_allowd_user_type } = req.body;
        // Image uploading section end here
        const options = {
            condition: {
                _id: id
            },
            data: {
                ...(uwin_permission ? { uwin_permission: uwin_permission } : ''),
                ...(uwin_allowd_user_type ? { uwin_allowd_user_type: uwin_allowd_user_type } : ''),
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