const { string } = require('joi');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const kw_cms = new Schema({
  section_id   : { type: Number , required : true },
  page_name    : { type: String , required : true , unique : true },
  title        : { type: String },
  description  : { type: String },
  sections     : { type: Array },  // Array storing variable to cover multiple section uplaoding module in cms.
  sections1    : { type: Array },   // Array storing variable to cover multiple section uplaoding module in cms.
  where_to_play: { type: String },  
  status       : { type: String , enum : ["A","I","D"], default : "A" },
  created_ip   : { type: String , trim : true },
  update_ip    : { type: String , trim : true },
  created_by   : { type: Schema.Types.ObjectId , trim : true },
  updated_by   : { type: Schema.Types.ObjectId , trim : true },
},{ timestamps: true ,collection: 'kw_cms', versionKey: false });
module.exports = mongoose.model('kw_cms', kw_cms);
