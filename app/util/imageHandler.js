const crypto = require('crypto');
const fs = require('fs');
const generateFileName = (bytes = 16) => crypto.randomBytes(bytes).toString('hex');
const util = require('util');
const writeFileAsync = util.promisify(fs.writeFile);
const request = require('request');
const path_join  = require('path');
/* ********************************************************************************
* Function Name   : upload_img
* For             : public
* Purposes        : This function is used toupload image to s3 bucket
* Creation Date   : 19-09-2023
* Created By      : Afsar Ali
* Update By       : 
* Update Date     : 
************************************************************************************/ 
exports.upload_img = async (file, path) => {
    return new Promise(async (resolve, reject) => {
        try{
            const {buffer} = file;
            const imgName = generateFileName();
            // const imgUrl = `${__basePath}../assets/${path}/${imgName}.jpeg`;
            const imgUrl = path_join.join(__dirname,'../../../',`k-winn/assets/${path}/${imgName}.jpeg`);
            console.log('img',imgUrl);
            await writeFileAsync(imgUrl, buffer);
            resolve(`./assets/${path}/${imgName}.jpeg`)
        } catch (error){
            console.log('error',error);
            const result = "";
            reject(JSON.stringify(result));
        }
    });
};

/* ********************************************************************************
* Function Name   : videoHandler
* For             : public
* Purposes        : This function is used toupload image to s3 bucket
* Creation Date   : 19-09-2023
* Created By      : Dilip Halder
************************************************************************************/ 
exports.upload_video = async (file, path) => {
    return new Promise(async (resolve, reject) => {
        try{
            const {buffer} = file;
            const videoName = generateFileName();
            // const imgUrl = `${__basePath}../assets/${path}/${imgName}.jpeg`;
            // const videoUrl = path_join.join(__dirname,'../../../',`assets/${path}/${videoName}.mp4`);
            const imgUrl = path_join.join(__dirname,'../../../',`k-winn/assets/${path}/${videoName}.mp4`);
            console.log('video',videoUrl);
            await writeFileAsync(videoUrl, buffer);
            resolve(`./assets/${path}/${videoName}.mp4`)
        } catch (error){
            console.log('error',error);
            const result = "";
            reject(JSON.stringify(result));
        }
    });
};

/* ********************************************************************************
* Function Name   : upload_img
* For             : public
* Purposes        : This function is used toupload image to s3 bucket
* Creation Date   : 19-09-2023
* Created By      : Afsar Ali
* Update By       : 
* Update Date     : 
************************************************************************************/ 
exports.upload_multiple_img = async (files,path ='') => {
    try{
        const imgUrl = Promise.all(files.map(async (file) => {
            const {buffer} = file;
            const imgName = generateFileName();
            const imgUrl = `./app/public/${path}/${imgName}.jpeg`;
            await writeFileAsync(imgUrl, buffer);
            return `./assets/${path}/${imgName}.jpeg`
            
        }))
        return imgUrl;
    } catch (error){
        // const result = {'result':'result', 'message' : "Not Upload", "status" : 400};
        const result = "";
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
        // const imgUrl = path_join.join(__basePath, "../", fileName);
        const imgUrl = path_join.join(__dirname,'../../../',`k-winn/${fileName}`);
        fs.unlink(imgUrl, (error) => {
            if (error) {
                console.error(error);
            } else {
                console.log(`File deleted: ${imgUrl}`);
            }
        });
    } else{
        return false;
    }

};


/*******************************************************************************
* Function Name   : upload_image_by_url
* For             : public
* Purposes        : This function is used to upload media to s3 bucket by image URL
* Creation Date   : 06-08-2024
* Created By      : Afsar Ali
* Update By       : 
* Update Date     : 
************************************************************************************/ 
exports.upload_image_by_url = async (url='') => {
    return new Promise(async (resolve, reject) => {
        try{
            request({ url, encoding: null }, async (err, resp, buffer) => {
                const mimetype = 'image/jpeg';
                const fileExtension = mimetype.split('/')[1];
                const fileName = 'img';
                console.log('buffer',buffer);
                console.log('url',url);
                
                var options = {
                    'method': 'POST',
                    'url': 'URL',
                    'headers': {
                    },
                    formData: {
                        file: {
                            value: buffer,
                            options: {
                                filename: fileName,  
                                contentType: mimetype    
                            }
                        }
                    }
                };
                request(options, function (error, response) {
                    if (error) throw new Error(error);
                    console.log('img',response.body);
                    resolve(`${response.body}`);
                });
            });
        } catch (error){
            const result = "";
            reject(JSON.stringify(result));
        }
    });
}