const { string } = require('joi');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const kw_allowed_user = new Schema({
  uwin_permission       : { type: String , required : true },
  uwin_allowd_user_type : { type: Array , required : true },
  created_ip            : { type: String , trim : true },
  update_ip             : { type: String , trim : true },
  status                : { type: String , enum : ["A","I","D"], default : "A" },
  created_by            : { type: Schema.Types.ObjectId , trim : true },
  updated_by            : { type: Schema.Types.ObjectId , trim : true },
},{ timestamps: true ,collection: 'kw_allowed_user', versionKey: false });
module.exports = mongoose.model('kw_allowed_user', kw_allowed_user);
