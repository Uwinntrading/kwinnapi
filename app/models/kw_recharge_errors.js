const { string } = require('joi');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const kw_recharge_errors = new Schema({   
     req_id         : { type : Number, required : true, trim : true },
     sl_no          : { type: String, required: true },
     mobile_no      : { type: String, required: true },
     topup          : { type: String, required: true },
     error_responce : { type: String, required: true },
     status                 : {
        type: String,
        enum: ["A","I","B","D"],            //A-Active, I-Inactive, B-Block, D-Delete
        default: "A"
    }
},{timestamps: true});

module.exports = mongoose.model('kw_recharge_errors', kw_recharge_errors);
