const mongoose = require('mongoose');
const moment = require('moment');
const crypto = require('crypto');

/**
 * convert string to mongo object id
 * @param {String} id - String value
 * @returns {ObjectId}
 */
 function stringToObjectId(id){
    return new mongoose.Types.ObjectId(id);
}
function createSlug(input) {
  return input
    .toString()                    // Convert to string
    .toLowerCase()                 // Convert to lowercase
    .replace(/\s+/g, '-')          // Replace spaces with hyphens
    .replace(/[^\w-]+/g, '')       // Remove non-word characters (excluding hyphens)
    .replace(/--+/g, '-');         // Replace multiple hyphens with a single hyphen
}
//This function is used for validate promocode date
function isPromoCodeValid(promoCode) {
  const currentDateTime = moment();
  const validDateTime = moment(promoCode.valid_date);
  const expireDateTime = moment(promoCode.expire_date);

  validDateTime.set({
    hour: parseInt(promoCode.valid_time.split(':')[0]),
    minute: parseInt(promoCode.valid_time.split(':')[1])
  });

  expireDateTime.set({
    hour: parseInt(promoCode.expire_time.split(':')[0]),
    minute: parseInt(promoCode.expire_time.split(':')[1])
  });
  
  if (currentDateTime.isBetween(validDateTime, expireDateTime, null, '[]')) {
    return true;
  } else {
    return false;
  }
}

function generateRandomString(){
  return crypto.randomBytes(45).toString('base64').slice(0, 60);
}

function loginIP(req){
  try {
    return req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  } catch (error) {
    return ':1'
  }
}

function getIpAddress(req){
  try {
    return req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  } catch (error) {
    return ':1'
  }
}

function currentTimestamp(){
  return Math.floor(Date.now() / 1000);
}


function randomOtp(Value) {
  return Math.floor(100000 + Math.random() * 900000); 
}

function verifyCode(Value) {
  return Math.floor(1000 + Math.random() * 9000); 
}

// Regex..
function isNumber(Value) {
  return  /^\d+$/.test(Value);
}

function isEmail(Value) {
  return /^\S+@\S+\.\S+$/.test(Value)
}

function isPhone(Value) {
  return /^\+?\d{1,4}?\s?\d{7,15}$/.test(Value);
}

function AdminUserID(req) {
  return req.user.userId;
}

module.exports = {
    stringToObjectId,
    createSlug,
    isPromoCodeValid,
    generateRandomString,
    loginIP,
    currentTimestamp,
    randomOtp,
    verifyCode,
    //regex
    isNumber,
    isEmail,
    isPhone,
    AdminUserID,
    getIpAddress
    
};