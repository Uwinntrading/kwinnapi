const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const crm_transactions = new Schema({
  load_balance_id: { type: Number, required: true },
  invoice_data : { type: Schema.Types.ObjectId },
  debit_user: { type: Schema.Types.ObjectId },
  credit_user : { type: Schema.Types.ObjectId },
  from_user : { type: Schema.Types.ObjectId },
  
  amount : { type: Number, required: true },
  before_amount : { type: Number },
  after_amount : { type: Number },
  
  record_type : { type: String, required: true },
  narration : { type: String, required: true },
  remarks : { type: String },
  payment_mode : { type: String, default : "Cash" },
  payment_status : { type: String, default : "Success" },

  is_reverse : { type: String, default : "N" },
  
  creation_ip : { type: String },
  created_by : { type: Schema.Types.ObjectId },
  created_by_users_type : { type: String },
  status : { type: String, required: true },
},{timestamps: true, collection: 'crm_transactions'});

module.exports = mongoose.model('crm_transactions', crm_transactions);