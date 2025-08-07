const { string, required } = require('joi');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const kw_enablesms = new Schema({
  section_id        : { type : Number , required : true }, 
  smscountry        : { type: String , required : true , enum : ["enable","disable"], default : "disable" },
  sms_country_available_country : { type: String , required : true },
  digitizebird       : { type: String , required : true , enum : ["enable","disable"], default : "disable" },
  digitizebird_available_country : { type: String , required : true },

  created_ip   : { type: String , trim : true },
  update_ip    : { type: String , trim : true },
  status       : { type: String , enum : ["A","I","D"], default : "A" },
  created_by   : { type: Schema.Types.ObjectId , trim : true },
  updated_by   : { type: Schema.Types.ObjectId , trim : true },
},{ timestamps: true ,collection: 'kw_enablesms', versionKey: false });
module.exports = mongoose.model('kw_enablesms', kw_enablesms);
