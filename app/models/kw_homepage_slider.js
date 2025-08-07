const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const kw_homepage_slider = new Schema({
  section_id            : { type: Number, required: true },
  slider_video          : { type: String, required: true },
  slider_video_alt      : { type: String},
  slider_description    : { type: String },
  pagename              : { type: String },
  status                : { type: String ,required: true , enum: ['A','I','D'], defalut: 'A'},
  created_ip            : { type: String },
  update_ip             : { type: String },
  created_by            : { type: Schema.Types.ObjectId },
  updated_by            : { type: Schema.Types.ObjectId },
},{ timestamps: true, versionKey: false , collection:'kw_homepage_slider' });

module.exports = mongoose.model('kw_homepage_slider', kw_homepage_slider);
