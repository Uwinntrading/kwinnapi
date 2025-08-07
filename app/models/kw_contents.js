const { string } = require('joi');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const kw_contents = new Schema({
  seq_id                   : { type : Number, required : true, trim : true },
  upload_type              : { type: String, required : true, trim : true },
  image                    : { type: String, trim : true },

  added_for_top_banner     : { type: Array, trim : true },
  added_for_recent_winners : { type: Array, trim : true },
  added_for_result_page    : { type: Array, trim : true },
  added_for_winner_gallery : { type: Array, trim : true },

  status                   : { type: String , enum : ["A","I","D"], default : "A" },
  created_by               : { type: Schema.Types.ObjectId , trim : true },
  updated_by               : { type: Schema.Types.ObjectId , trim : true },
},{ timestamps: true ,collection: 'kw_contents', versionKey: false });
module.exports = mongoose.model('kw_contents', kw_contents);
