/**********************************************************************
 * Function Name    :   select
 * Purposs          :   This function is used for select from admin user table
 * Created By       :   AFsar Ali
 * Created Data     :   06-JAN-2024
 * Updated By       :   
 * Update Data      :
 * Remarks          : 
 **********************************************************************/
exports.authCheck = async function (permission, userID) {
    try {
      return true;
    } catch (error) {
      return Promise.reject(error);
    }
}//End of Function