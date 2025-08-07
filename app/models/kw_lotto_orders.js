const { required } = require('joi');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const kw_lotto_orders = new Schema({
  sequence_id: { type: Number, required: true },
  order_id: { type: String, required: true },
  user_data: { type: Schema.Types.ObjectId, required: true },
  user_type: { type: String, required: true },
  user_email: { type: String, default: "" },
  user_phone: { type: Number, required: true },
  store_name: { type: String, default: null },
  product_data: { type: Schema.Types.ObjectId, required: true },
  product_title: { type: String, required: true },
  product_qty: { type: String, required: true },
  prize_title: { type: String, required: true },
  vat_amount: { type: Number },
  straight_add_on_amount: { type: Number },
  rumble_add_on_amount: { type: Number },
  reverse_add_on_amount: { type: Number },
  subtotal: { type: Number },
  total_price: { type: Number },
  availableArabianPoints: { type: Number },
  end_balance: { type: Number },
  payment_mode: { type: String, trim: true },
  payment_from: { type: String, trim: true },
  product_is_donate: { type: Boolean, default: null },
  order_status: { type: String, required: true },
  device_type: { type: String,  },
  app_version: { type: String,  },
  ticket: { type: String, required: true },
  selection_values : { type: String },
  draw_date_time : {type : Date, trim : true},

  pos_number : { type: Number, required: true },
  is_print : { type: String, required: true, default : "N" },

  order_first_name: { type: String, default: null },
  order_last_name: { type: String, default: null },
  order_users_country_code: { type: String, default: "+971" },
  order_users_mobile: { type: String, default: null },
  order_users_email: { type: String, default: null },
  SMS: { type: String, default: null },
  creation_ip: { type: String },
  created_at: { type: Date },
  refund_date: { type: Date },
  update_date: { type: Date },
  update_ip: { type: String  },
  updated_by: { type: Number },
},{timestamps: true});

module.exports = mongoose.model('kw_lotto_orders', kw_lotto_orders);
