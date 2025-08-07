const { string } = require('joi');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const kw_admin = new Schema({
  admin_id            : { type: Number , required : true },
  admin_title         : { type: String },
  admin_first_name    : { type: String , required : true },
  admin_middle_name   : { type: String  },
  admin_last_name     : { type: String , required : true },
  admin_email         : { type: String , unique: true },
  admin_country_code  : { type: String , required : true },
  admin_phone         : { type: Number , unique: true },
  admin_password      : { type: String },
  admin_password_otp  : { type: Number },
  admin_pin           : { type: Number },
  admin_image         : { type: String },
  admin_city          : { type: String },
  admin_state         : { type: String },
  admin_address       : { type: String },
  admin_country       : { type: String },
  admin_pincode       : { type: String },
  department_id       : { type: Number },
  department_name     : { type: String },
  designation_id      : { type: Number },
  designation_name    : { type: String },
  admin_type          : { type: String },
  last_login_ip       : { type: String },
  last_login_date     : { type: Number },
  token               : { type: String },
  created_ip          : { type: String , trim : true },
  update_ip           : { type: String , trim : true },
  created_by          : { type: Schema.Types.ObjectId , trim : true },
  updated_by          : { type: Schema.Types.ObjectId , trim : true },
  status              : { type: String , enum : ["A","I","D"], default : "A" },
},{ timestamps: true ,collection: 'kw_admin', versionKey: false });

module.exports = mongoose.model('kw_admin', kw_admin);
