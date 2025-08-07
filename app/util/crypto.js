const crypto = require('crypto');
const constant = require('../config/constant');

/**
 * Encrypt Data
 * @method
 * @param {String} plainText
 * @param {String} workingKey
 * @param {String} iv
 * @return {String}
 */
const encrypt = function (plainText, workingKey, iv) {
	let m = crypto.createHash('md5');
    m.update(workingKey);
   	let key = m.digest('buffer');
	let cipher = crypto.createCipheriv(constant.crypto.algo, key, iv);
	let encoded = cipher.update(plainText.toString(), constant.crypto.encoding, constant.crypto.digest);
	encoded += cipher.final(constant.crypto.digest);
    return encoded;
};

/**
 * Decrypt Data
 * @method
 * @param {String} encryptedText
 * @param {String} workingKey
 * @param {String} iv
 * @return {String}
 */
const decrypt = function (encText, workingKey, iv) {
    let m = crypto.createHash('md5');
    m.update(workingKey)
    let key = m.digest('buffer');
	let decipher = crypto.createDecipheriv(constant.crypto.algo, key, iv);
    let decoded = decipher.update(encText, constant.crypto.digest, constant.crypto.encoding);
	decoded += decipher.final(constant.crypto.encoding);
    return decoded;
};

const createMD5Hash = function (password) {
    const md5Hash = crypto.createHash('md5');
    return md5Hash.update(password).digest('hex');
};

const checkMD5Password = function (password, hashedPassword) {

    const md5Hash = crypto.createHash('md5');
    const encpass =  md5Hash.update(password).digest('hex');
    if(encpass === hashedPassword){
        return true;
    } else{
        return false;
    }
}

const base64_encode = async (string) =>{
    try {
        const text = string.toString();
        return Buffer.from(text).toString('base64');
    } catch (error) {
        return '';
    }
}

const base64_decode = async (string) =>{
    try {
        return Buffer.from(string, 'base64').toString('utf-8');
    } catch (error) {
        return '';
    }
}

module.exports = {
    encrypt,
    decrypt,
    createMD5Hash,
    checkMD5Password,
    base64_encode,
    base64_decode
};