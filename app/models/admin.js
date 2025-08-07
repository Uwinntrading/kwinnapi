const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const admins = new Schema({
    admin_id : { type: Number, required: true, trim: true },
    admin_title : { type: String, required: true, trim: true },
	admin_first_name: { type: String, required: true, trim: true },
	admin_middle_name: { type: String,  trim: true },
	admin_last_name: { type: String,  trim: true },
    admin_email: { type: String, required: true, trim: true },
    admin_phone: { type: Number, trim: true },
    admin_password : { type: String, required: true, trim: true },
    admin_otp : { type: Number, trim: true },
    
    department_name : { type: String, trim: true },
    
    designation_name : { type: String, trim: true },
    admin_type : { type: String, trim: true },
    status: { type: String, enum: ["A","I","B","D"], default: "A" },//A-Active, I-Inactive, B-Block, D-Delete

    last_login_ip : { type: String, trim: true },
    last_login_date : { type: Date, trim: true },
    
    creation_ip : { type: String, trim: true },    
    created_by : { type: Schema.Types.ObjectId, ref: "admins" },

    update_ip : { type: String, trim: true },
    updated_by : { type: Schema.Types.ObjectId, ref: "admins" },

    token: { type: String, trim: true },
}, {timestamps: true, collection: 'crm_admin'});

module.exports = mongoose.model('crm_admins', admins);
