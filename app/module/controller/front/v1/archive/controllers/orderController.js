const response = require("../../../../../../util/response");
const OrderServices = require("../../../../../services/front/v1/lottoOrderServices");
const OrderArchiveServices = require("../../../../../services/front/v1/lottoOrderArchiveServices");
 /*********************************************************************************
 * Function Name    :   List
 * Purposs          :   This function is used for get lotto orders list
 * Created By       :   Afsar Ali
 * Created Data     :   06-SEPT-2024
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
        const result = await OrderServices.select(listWhere);
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
 * Created Data     :   09-SEPT-2024
 * Updated By       :   
 * Update Data      :
 * Remarks          :
 ********************************************************************************/
 exports.updateFormatedDate = async function (req, res) {
    try {
        // console.log('Update order Formated Date');
        let listWhere = {
            condition : { formatted_created_at : {$exists: false} },
            limit : 2000
        }
        const result = await OrderServices.select(listWhere);
        if(result && result.length > 0){
            result.map(async (item)=>{
                const options = {
                    condition : { _id : item._id},
                    data : { formatted_created_at : item.created_at }
                }
                await OrderServices.updateData(options);
            })
        }
        return true
        return response.sendResponse(res, response.build('SUCCESS', {  }));
    } catch (error) {
        console.log('error',error)
        return true;
        return response.sendResponse(res, response.build('ERROR_SERVER_ERROR', { error }));
    }
  }; //End of Function

  /*********************************************************************************
 * Function Name    :   movetoarchive
 * Purposs          :   This function is used for move date to archive
 * Created By       :   Afsar Ali
 * Created Data     :   10-SEPT-2024
 * Updated By       :   
 * Update Data      :
 * Remarks          :
 ********************************************************************************/
 exports.movetoarchive = async function (req, res) {
    try {
        // console.log('Move order');
        var date65DaysAgo = new Date();
        date65DaysAgo.setDate(date65DaysAgo.getDate() - 65);
        let listWhere = {
            condition : { formatted_created_at : {$lte : date65DaysAgo} },
            limit : 2000
        }        
        const orderData = await OrderServices.select(listWhere);
        const IdList = orderData.map((item)=>item._id);
        const archiveInsertResult = await OrderArchiveServices.create(orderData);
        if (archiveInsertResult && archiveInsertResult.length === orderData.length) {
            await OrderServices.deleteData({ _id: { $in: IdList } });
            // return response.sendResponse(res, response.build('SUCCESS', {}));
        } else {
            // return response.sendResponse(res, response.build('SUCCESS', { }));
        }
        return true
    } catch (error) {
        console.log('error',error);
        return true;
        return response.sendResponse(res, response.build('ERROR_SERVER_ERROR', { error }));
    }
  }; //End of Function