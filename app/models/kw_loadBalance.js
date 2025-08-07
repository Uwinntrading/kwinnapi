const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const kw_loadBalance = new Schema({
  load_balance_id: { type: Number, required: true },
  orderdata: { type: Schema.Types.ObjectId },
  product_id : { type: Schema.Types.ObjectId },
  debit_user: { type: Schema.Types.ObjectId },
  order_id : { type: String, trim: true },
  campaignOrderData : { type: Schema.Types.ObjectId },
  campaignOrderNo : { type: String },
  rechargeId      : { type: String },
  rechargeData    : { type: Schema.Types.ObjectId },
  credit_user : { type: Schema.Types.ObjectId  },
  points : { type: Number, required: true },
  availableArabianPoints : { type: Number, required: true },
  end_balance : { type: Number, required: true },

  availableReachargePoints : { type: Number },
  end_ReachargePoints : { type: Number },
  record_type : { type: String, required: true },
  narration : { type: String, required: true },
  remarks : { type: String },
  
  // optional fields
  rechargeId   : { type: String},
  rechargeData : { type: Schema.Types.ObjectId },

  creation_ip : { type: String },
  created_at : { type: Date, required: true },
  created_by : { type: Schema.Types.ObjectId },
  status : { type: String, required: true },
  created_user_id : { type: Number },
  formatted_created_at: { type: Date }
  
  

},{timestamps: true, collection: 'kw_loadBalance'});

module.exports = mongoose.model('kw_loadBalance', kw_loadBalance);
