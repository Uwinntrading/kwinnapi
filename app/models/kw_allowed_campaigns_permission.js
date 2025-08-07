const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const kw_allowed_campaigns_permission = new Schema({
  section_id            : { type: Number, required: true },
  seleted_campaign      : { type: Array },
  seleted_users         : { type: Array },
  status                : { type: String ,required: true , enum: ['A','I','D'], defalut: 'A'},
  created_ip            : { type: String },
  update_ip             : { type: String },
  created_by            : { type: Schema.Types.ObjectId },
  updated_by            : { type: Schema.Types.ObjectId },
},{ timestamps: true, versionKey: false , collection:'kw_allowed_campaigns_permission' });

module.exports = mongoose.model('kw_allowed_campaigns_permission', kw_allowed_campaigns_permission);