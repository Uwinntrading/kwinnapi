const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const kw_admin_designation = new Schema({
  designation_id      : { type: Number, required: true },
  designation_name    : { type: String, required: true , unique : true },
  designation_slug    : { type: String, required: true , unique : true },
  designation_used    : { type: String, required: true },
  status              : { type: String, required: true },
  creation_ip         : { type: String, trim : true },
  updated_ip          : { type: String, trim : true },
  created_by          : { type: Schema.Types.ObjectId, trim : true },
  updated_by          : { type: String, trim : true },
},{timestamps: true, versionKey: false});

module.exports = mongoose.model('kw_admin_designation', kw_admin_designation);
