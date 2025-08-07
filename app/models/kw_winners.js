const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const kw_winners = new Schema({
  batch_id          : { type: Number, required : true, trim : true },
  order_no          : { type: String, required : true, trim : true },

  seller_first_name : { type: String, required : true, trim : true },
  seller_last_name  : { type: String, required : true, trim : true },
  seller_mobile     : { type: String, required : true, trim : true },
  
  coupon_code       : { type: String, required : true, trim : true },
  matching_code     : { type: String, required : true, trim : true },
  
  straight_amount   : { type: Number, required : true, trim : true },
  rumble_amount     : { type: Number, required : true, trim : true },
  chance_amount     : { type: Number, required : true, trim : true },
  
  winner_type       : { type: String, required : true, trim : true },
  winning_amount    : { type: Number, required : true, trim : true },
  // pos_number        : { type: Number, required : true, trim : true },
  // store_name        : { type: String, required : true, trim : true },
  file              : { type: String, required : true, trim : true }, 
  status            : { type: String, required : true, enum : ["Active","Inactive", "Redeemed","Canceled"], trim : true },
  redeem_by         : { type: Schema.Types.ObjectId, trim : true },
  redeem_name       : { type: String, trim : true },
  redeem_pos        : { type: Number, trim : true },
  redeem_date       : { type: Date, trim : true },
  
  created_by : { type: Schema.Types.ObjectId },
  created_ip : { type: String },
  update_by : { type: Schema.Types.ObjectId },
  update_ip : { type: String },
  
},{timestamps: true, versionKey: false });

module.exports = mongoose.model('kw_winners', kw_winners);
