const response = require("../../../../../../util/response");
const counter   = require("../../../../../services/counterService");
const {isValidObjectId} = require("../../../../../../util/valueChecker");

 
/*********************************************************************************
 * Function Name    :  list
 * Purpose          :  This function is  ot get winner statement list
 * Created By       :  Dilip Halder
 * Created Data     :  20-02-2025
 ********************************************************************************/
exports.list = async function (req, res) {

    try {
        const usrId = req.user.userId;
        const { condition={}, select ={}, sort={}, type, skip, limit }=req.body;
        
        if(!isValidObjectId(usrId)){
            return response.sendResponse(res, response.build('PERMISSION_ERROR', { }));
        } else{

            const result = await counter.getOrerId(condition.conditionName);
            if( result!= '' ){
                return response.sendResponse(res, response.build('SUCCESS',{ result :result } ));
            } else {
                return response.sendResponse(res, response.build('ERROR_DATA_NOT_FOUND',{ result :[]} ));
            }

        }
    } catch (error) {
        console.log('error', error)
        return response.sendResponse( res, response.build("ERROR_SERVER_ERROR", { error }));
    }
}

/*********************************************************************************
 * Function Name    :   update
 * Purposs          :   This function is used update data
 * Created By       :   Dilip Halder
 * Created Data     :   08 April 2025
 **********************************************************************************/
exports.update = async function (req, res) {
    try {  

        console.log(req.body)

        // Destructure the request body
        const {  id , status   } = req.body;

        const options = {
            condition: {
                _id: id,
            },
            data: {
                ...(status ? { status: status } : ''),
            },
        };

        const UpdatedResponse = await counterServices.updateData(options);
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

