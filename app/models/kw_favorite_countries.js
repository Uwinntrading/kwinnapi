const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const kw_favorite_countries = new Schema({
  name         : { type: String , required : true , trim : true },
  created_by   : { type: Schema.Types.ObjectId , trim : true },
},{ timestamps: true , versionKey: false });
module.exports = mongoose.model('kw_favorite_countries', kw_favorite_countries);
