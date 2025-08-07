const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const kw_loadBalance_archives = new Schema({
  _id : {type : Schema.Types.ObjectId },
  load_balance_id: { type: Number, required: true },
  order_oid: { type: Schema.Types.ObjectId  },
  user_oid: { type: Schema.Types.ObjectId },
  user_id_deb: { type: Number },
  order_id : { type: String },
  user_id_cred : { type: Number },
  upoints : { type: Number },
  availableArabianPoints : { type: Number },
  end_balance : { type: Number },
  record_type : { type: String, required: true },
  narration : { type: String },
  remarks : { type: String },
  creation_ip : { type: String },
  created_at : { type: String, required: true },
  created_by : { type: Number },
  status : { type: String, required: true },
  created_user_id : { type: Number },
  formatted_created_at: { type: Date }
},{timestamps: true});

module.exports = mongoose.model('kw_loadBalance_archives', kw_loadBalance_archives);
