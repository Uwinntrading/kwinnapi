const { string, required } = require('joi');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const kw_campaign_freezing = new Schema({
  section_id                : { type : Number , required : true }, 
  campaign_freezing         : { type: String , required : true , enum : ["enable","disable"], default : "disable" },
  freezing_title            : { type: String , required : true },
  auto_campaign_freezing    : { type: String , required : true , enum : ["enable","disable"], default : "disable" },
  Freezing_time_start       : { type: String , required : true },
  created_ip                : { type: String , trim : true },
  update_ip                 : { type: String , trim : true },
  status                    : { type: String , enum : ["A","I","D"], default : "A" },
  created_by                : { type: Schema.Types.ObjectId , trim : true },
  updated_by                : { type: Schema.Types.ObjectId , trim : true },
},{ timestamps: true ,collection: 'kw_campaign_freezing', versionKey: false });
module.exports = mongoose.model('kw_campaign_freezing', kw_campaign_freezing);
