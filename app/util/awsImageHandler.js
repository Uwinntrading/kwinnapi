const crypto = require('crypto');
const { AWSS3BUCKETCONFIG } = require("../config/constant");
const { S3Client, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const generateFileName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex');

const s3 =new S3Client({
    region : AWSS3BUCKETCONFIG.REGION,
    credentials : {
        accessKeyId : AWSS3BUCKETCONFIG.ACCESSKEYID,
        secretAccessKey : AWSS3BUCKETCONFIG.SECRETACCESSKEY
    }
});

/* ********************************************************************************
* Function Name   : upload_img
* For             : public
* Purposes        : This function is used toupload image to s3 bucket
* Creation Date   : 19-09-2023
* Created By      : Afsar Ali
* Update By       : 
* Update Date     : 
************************************************************************************/ 
exports.upload_img = async function (file) {
    // console.log('file.buffer',file.buffer);
    const imgName = generateFileName();
    const params = {
        Bucket      : AWSS3BUCKETCONFIG.BUCKETNAME,
        Key         : imgName,
        Body        : file.buffer,
        ContentType : file.mimetype
    }
    const command = new PutObjectCommand(params);
    const data = await s3.send(command);
    if(data && data.$metadata.httpStatusCode){
        const result = {'imgName' : AWSS3BUCKETCONFIG.AWSIMAGEBASEURL+imgName, 'message' : "Upload Successfully", "status" : data.$metadata.httpStatusCode}
        return JSON.stringify({result});
    } else{
        const result = {'result':result, 'message' : "Not Upload", "status" : 400};
        return JSON.stringify(result);
    }
};

/* ********************************************************************************
* Function Name   : delete_img
* For             : public
* Purposes        : This function is used toupload image to s3 bucket
* Creation Date   : 19-09-2023
* Created By      : Afsar Ali
* Update By       : 
* Update Date     : 
************************************************************************************/ 
exports.delete_img = async function (fileName) {
    if(fileName){
        const deleteParams = {
            Bucket: AWSS3BUCKETCONFIG.BUCKETNAME,
            Key: fileName,
          }
        const data = await s3.send(new DeleteObjectCommand(deleteParams));
        if(data && data.DeleteMarker === true){
            return JSON.stringify({"status" : 200, "message" : "Image deleted successfully."});
        }else{
            return JSON.stringify({"status" : 400, "message" : "Oops!! Image not delete.", "data" : data?data:""});
        }
    }
};