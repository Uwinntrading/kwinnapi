const response = require("../../../../../../util/response");
const winnersServices = require("../../../../../services/front/v1/winnersServices");
const winnersArchiveServices = require("../../../../../services/front/v1/winnerArchiveServices");
 /*********************************************************************************
 * Function Name    :   List
 * Purposs          :   This function is used for get loadbalance list
 * Created By       :   Afsar Ali
 * Created Data     :   11-SEPT-2024
 * Updated By       :   
 * Update Data      :
 * Remarks          :
 ********************************************************************************/
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
        const result = await winnersServices.select(listWhere);
        return response.sendResponse(res, response.build('SUCCESS', { result }));
    } catch (error) {
        console.log('error',error)
        return response.sendResponse(res, response.build('ERROR_SERVER_ERROR', { error }));
    }
  }; //End of Function

 /*********************************************************************************
 * Function Name    :   updateFormatedDate
 * Purposs          :   This function is used for update fromated date
 * Created By       :   Afsar Ali
 * Created Data     :   11-SEPT-2024
 * Updated By       :   
 * Update Data      :
 * Remarks          :
 ********************************************************************************/
 exports.updateFormatedDate = async function (req, res) {
    try {
        console.log('Update winners Formated Date');
        let listWhere = {
            condition : { formatted_created_at : {$exists: false} },
            sort : {_id : 1},
            limit : 2000
        }
        const result = await winnersServices.select(listWhere);
        result.map(async (item)=>{
            const options = {
                condition : { _id : item._id},
                data : { formatted_created_at : item.created_at }
            }
            await winnersServices.updateData(options);
        });
        return true;
        return response.sendResponse(res, response.build('SUCCESS', { result }));
    } catch (error) {
        console.log('error',error);
        return true;
        return response.sendResponse(res, response.build('ERROR_SERVER_ERROR', { error }));
    }
  }; //End of Function

  /*********************************************************************************
 * Function Name    :   movetoarchive
 * Purposs          :   This function is used for move date to archive
 * Created By       :   Afsar Ali
 * Created Data     :   11-SEPT-2024
 * Updated By       :   
 * Update Data      :
 * Remarks          :
 ********************************************************************************/
 exports.movetoarchive = async function (req, res) {
    try {
        console.log('Move winners');
        var date65DaysAgo = new Date();
        date65DaysAgo.setDate(date65DaysAgo.getDate() - 65);
        let listWhere = {
            condition : { formatted_created_at : {$lte : date65DaysAgo} },
            limit : 2000
        }        
        const orderData = await winnersServices.select(listWhere);
        if(orderData && orderData.length > 0){
            const IdList = orderData.map((item)=>item._id);
            const archiveInsertResult = await winnersArchiveServices.create(orderData);
            if (archiveInsertResult && archiveInsertResult.length === orderData.length) {
                await winnersServices.deleteData({ _id: { $in: IdList } });
                // return response.sendResponse(res, response.build('SUCCESS', {}));
            } else {
                // return response.sendResponse(res, response.build('SUCCESS', { }));
            }
        }else{
            // return response.sendResponse(res, response.build('SUCCESS', { }));
        }
        return true;
    } catch (error) {
        console.log('error',error);
        return true;
        return response.sendResponse(res, response.build('ERROR_SERVER_ERROR', { error }));
    }
  }; //End of Function