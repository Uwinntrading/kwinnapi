const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const kw_admin_login_log = new Schema({
  login_log_id   : { type: Number, required: true },
  admin_id       : { type: Number, required: true },
  admin_token    : { type: String, required: true },
  login_status   : { type: String, required: true },
  login_datetime : { type: String, required: true },
  login_ip       : { type: String, required: true },
  created_ip     : { type: String },
  update_ip      : { type: String },
  created_by     : { type: Schema.Types.ObjectId },
  updated_by     : { type: Schema.Types.ObjectId },
},{ timestamps: true, versionKey: false , collection:'kw_admin_login_log' });

module.exports = mongoose.model('kw_admin_login_log', kw_admin_login_log);
