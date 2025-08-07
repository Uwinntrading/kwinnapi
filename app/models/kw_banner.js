const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const kw_banners = new Schema({
  section_id    : { type: Number, required: true },
  slider_image  : { type: String, required: true },
  page_name     : { type: String, required: true },
  show_on       : { type: String },
  status        : { type: String ,required: true , enum: ['A','I','D'], defalut: 'A'},
  created_ip    : { type: String },
  update_ip     : { type: String },
  created_by    : { type: Schema.Types.ObjectId },
  updated_by    : { type: Schema.Types.ObjectId },
},{ timestamps: true, versionKey: false , collection:'kw_banners' });

module.exports = mongoose.model('kw_banners', kw_banners);
