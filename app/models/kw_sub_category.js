const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const kw_sub_category = new Schema({
  category_id           : { type: Number, required: true },
  category_name         : { type: String, required: true },
  category_slug         : { type: String, required: true },
  sub_category          : { type: String, required: true , unique :true },
  sub_category_slug     : { type: String, required: true },
  sub_cat_image         : { type: String },
  sub_cat_image_alt     : { type: String, required: true },
  sub_category_id       : { type: Number, required: true },
  status                : { type: String ,required: true , enum: ['A','I','D'], defalut: 'A'},
  created_ip            : { type: String },
  created_by            : { type: Schema.Types.ObjectId },
  update_ip             : { type: String },
  updated_by            : { type: Schema.Types.ObjectId },
},{timestamps: true, versionKey: false});

module.exports = mongoose.model('kw_sub_category', kw_sub_category);
