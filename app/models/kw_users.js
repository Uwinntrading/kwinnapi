const { string } = require('joi');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const kw_users = new Schema({   
    users_type      : { type: String, trim : true, required : true },
    users_id        : {type : Number, trim : true, required : true },
    users_seq_id    : { type: String, trim : true, required : true },
    users_name      : { type: String, trim : true, required : true },
    last_name       : { type: String, trim : true, required : true },
    country_code    : { type: String, trim : true, required : true },
    users_mobile    : { type: Number, trim : true, required : true , unique : true },
    users_email     : { type: String, trim : true , unique : true },
    password        : { type: String, trim : true, required : true },
    
    area            : { type: String, trim : true },
    totalArabianPoints       : { type: Number, trim : true },
    availableArabianPoints   : { type: Number, trim : true },
    totalReachargePoints     : { type: Number, trim : true },
    availableReachargePoints : { type: Number, trim : true },
    term_condition         : { type: String, trim : true },
    users_otp              : { type: Number, trim : true },
    otp_sent               : { type: String, enum : ["WhatsApp", "SMS","Email"], default : "WhatsApp" },
    is_verify              : { type : String, enum : ["Y", "N"], default : 'N'},
    status                 : {
        type: String,
        enum: ["A","I","B","D"],            //A-Active, I-Inactive, B-Block, D-Delete
        default: "A"
    },
    summery_pin            : { type: Number, trim : true },
    redeeming_amount_limit : { type: Number, trim : true },
    referral_code          : { type: String, trim : true },
    bind_person_id         : { type: String, trim : true },
    bind_person_name       : { type: String, trim : true },
    bind_user_type         : { type: String, trim : true },
    pickup_point_holder    : { type: String, trim : true },
    pos_device_id          : { type: String, trim : true },
    pos_number             : { type: String, trim : true },
    commission_percentage  : { type: String, trim : true },
    international_recharge_commission_percentage  : { type: String, trim : true, default : '10' },
    store_name             : { type: String, trim : true },
    old_due_amount         : { type: Number, trim : true, default : 0 },
    due_amount             : { type: Number, trim : true, default : 0 },
    token                  : { type: String },
    created_at             : { type: Date },
    created_ip             : { type: String, trim : true },
    created_by             : { type: String, trim : true },
    created_from           : { type: String, trim : true },
    app_version            : { type: String, trim : true },
    app_name               : { type: String, trim : true },
    updated_at             : { type: Date },
    updated_ip             : { type: String, trim : true },
    created_by             : { type: String, trim : true },
    latitude               : { type: String, trim : true },
    longitude              : { type: String, trim : true },
    device_id              : { type: String, trim : true },
    device_type            : { type: String, trim : true },
    buy_ticket             : { type: String, trim : true },
    buy_voucher            : { type: String, trim : true },
    company_name           : { type: String, trim : true },
    company_address        : { type: String, trim : true },
    quick_user             : { type: String, trim : true },

},{timestamps: true});

module.exports = mongoose.model('kw_users', kw_users);
