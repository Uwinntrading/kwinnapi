const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const kw_admin_departments = new Schema({
  department_id    : { type: Number, required: true },
  department_name  : { type: String, required: true , unique :true },
  department_slug  : { type: String, required: true },
  department_used  : { type: String ,required: true , enum: ['Y','N'], defalut: 'N'},
  status           : { type: String ,required: true , enum: ['A','I','D'], defalut: 'A'},
  created_ip       : { type: String },
  created_by       : { type: Schema.Types.ObjectId },
  update_ip        : { type: String },
  updated_by       : { type: Schema.Types.ObjectId },
  __v              : { type: String },
},{timestamps: true, versionKey: false});

module.exports = mongoose.model('kw_admin_departments', kw_admin_departments);
