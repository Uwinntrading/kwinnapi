const moment = require("moment");
const _ = require("lodash");
const VerifyOtp = require('../models/verifyOtps');
const { OtpExpiry } = require("../config/constant");

class OtpVerification {
  /**
   *
   * @param {Object} data
   */
  static async isValidOtp(data) {
    //for testing, to be removed
    // if(data.code == 1111) return true;
    const condition = { code: data.code,phone:data.phone };
    const record = await VerifyOtp.findOne(condition);
    if (record) {
      //check for expiry
      if (
        moment().isAfter(
          moment(record.createdOn).add(OtpExpiry.value, OtpExpiry.duration)
        )
      )
        return false;
      //update otp verification
      await VerifyOtp.remove(condition);
      return true;
    }
    return false
    // throw new Error("Invalid otp");
  }

  static async isValidUserOtp(data) {
    const condition = { 
      code: data.code,
      phone:parseInt(data.phone) 
    };
    const record = await VerifyOtp.findOne(condition);
    if (record) {
      if (
        moment().isAfter(
          moment(record.createdOn).add(OtpExpiry.value, OtpExpiry.duration)
        )
      )
      await VerifyOtp.deleteMany(condition);
      return true;
    }
    return false
  }

  static async isValidAppOtp(data) {
    const { code, phone, country_code } = data;
    const condition = { 
      code: code,
      phone:parseInt(phone),
      country_code : country_code 
    };
    const record = await VerifyOtp.findOne(condition);
    if (record) {
      if (
        moment().isAfter(
          moment(record.createdOn).add(OtpExpiry.value, OtpExpiry.duration)
        )
      )
      await VerifyOtp.deleteMany(condition);
      return true;
    }
    return false
  }


  /******************
   * verofy email otp
   **************/
  static async isValidUserEmailOtp(data) {
    //for testing, to be removed
    const condition = { code: data.code,email:data.email };
    const record = await VerifyOtp.findOne(condition);
    if (record) {
      //check for expiry
      if (
        moment().isAfter(
          moment(record.createdOn).add(OtpExpiry.value, OtpExpiry.duration)
        )
      )
        //return false;
      //update otp verification
      await VerifyOtp.deleteMany(condition);
      return true;
    }
    return false
    //throw new Error("Invalid otp");
  }


}

/**
 * @type {OtpVerification}
 */
module.exports = OtpVerification;
