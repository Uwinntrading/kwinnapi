const { string } = require('joi');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const kw_paymentmode = new Schema({
  title_stripe : { type: String , required : true },
  stripe       : { type: String , required : true , enum : ["enable","disable"], default : "disable" },
  title_telr   : { type: String , required : true },
  telr         : { type: String , required : true , enum : ["enable","disable"], default : "disable" },
  title_noon   : { type: String , required : true },
  noon         : { type: String , required : true , enum : ["enable","disable"], default : "disable"},
  created_ip   : { type: String , trim : true },
  update_ip    : { type: String , trim : true },
  status       : { type: String , enum : ["A","I","D"], default : "A" },
  created_by   : { type: Schema.Types.ObjectId , trim : true },
  updated_by   : { type: Schema.Types.ObjectId , trim : true },
},{ timestamps: true ,collection: 'kw_paymentmode', versionKey: false });
module.exports = mongoose.model('kw_paymentmode', kw_paymentmode);
