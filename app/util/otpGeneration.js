const moment = require("moment");
const _ = require("lodash");
const VerifyOtp = require('../models/verifyOtps');
const {OtpRetry} = require("../config/constant");

/**
 * Numeric characters string: 0-9.
 * @type {string}
 */
const NUMERIC = "0123456789";

class OtpGeneration {
    /**
   * Generate a string of given length of random numeric digits.
   * @param {Number} length - desired output length. Must be > 0;
   * @return {string} generated output string.
   */
    static randomNumeric(length) {
        const random6DigitNumber = Math.floor(100000 + Math.random() * 900000);
        return random6DigitNumber;
    }

    static async canOtpGenerated(phone){
        const condition = {"phone":phone}
        const record = await VerifyOtp.findOne(condition).sort({createdOn:-1});
        if(record){
            //check for retry
            if (moment().isBefore(moment(record.createdOn).add(OtpRetry.value, OtpRetry.duration))) throw new Error("Request already sent try after sometime.");
        }
        return record;
    }

    static async canUserOtpGenerated(email){
        const condition = {"email":email}
        const record = await VerifyOtp.findOne(condition).sort({createdOn:-1});
        if(record){
            //check for retry
            if (moment().isBefore(moment(record.createdOn).add(OtpRetry.value, OtpRetry.duration))) throw new Error("Request already sent try after sometime.");
        }
        return record;
    }

    static async saveOtp(data) {
        //update createdOn
        if(data?.phone){
            const condition = {phone : parseFloat(data?.phone) };
            await VerifyOtp.deleteMany(condition);
        }
        data["createdOn"] = moment();
        console.log('sdsdf',data);
        return await VerifyOtp.create(data);
    }
}

/**
 * @type {OtpGeneration}
 */
module.exports = OtpGeneration;