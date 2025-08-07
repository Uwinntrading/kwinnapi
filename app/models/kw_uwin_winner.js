const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const kw_uwin_winner = new Schema({
  voucher_id: { type: Number, required: true },
  batch_id : { type: Number },
  csv_name : { type: String },
  order_id: { type: String },
  seller_first_name: { type: String },
  seller_last_name: { type: String },
  store_name : { type: String },
  code : { type: String },
  coupons : { type: String },
  amount : { type: Number },
  order_date : { type: String },
  products_id : { type: Number },
  status : { type: Number },
  created_at : { type: Number },
  created_by : { type: String },
  modified_at : { type: String },
  modified_by : { type: String },
  creation_ip : { type: String },
  created_ip : { type: String },
  pos_device_id : { type: String },
  soft_delete : { type: Number },
  redeem_by_mode : { type: String },
  redeem_status : { type: String },
  seller_id : { type: Number },

  formatted_created_at: { type: Date }
},{timestamps: true, collection: 'kw_uwin_winner'});

module.exports = mongoose.model('kw_uwin_winner', kw_uwin_winner);
