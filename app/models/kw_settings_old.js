const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const kw_settings = new Schema({
  lotto_settings_id                 : { type: Number, unique :true },
  pid                               : { type: String,  unique :true},
  straight_game_name                : { type: String, required: true },
  rumble_game_name                  : { type: String, required: true },
  reverse_game_name                 : { type: String, required: true },
  straight_settings                 : { type: String, required: true },
  rumble_settings                   : { type: String, required: true },
  reverse_settings                  : { type: String, required: true },
  straight_settings_default_check   : { type: String, required: true },
  rumble_settings_default_check     : { type: String, required: true },
  reverse_settings_default_check    : { type: String, required: true },
  campaign_auto_freezing_mode       : { type: String },
  campaign_freezing_start_time      : { type: String },
  campaign_freezing_end_time        : { type: String },
  game_rule_image                   : { type: String },
  game_description                  : { type: String },
  status                            : { type: String ,required: true , enum: ['A','I','D'], defalut: 'A'},
  created_ip                        : { type: String },
  created_by                        : { type: Schema.Types.ObjectId },
  update_ip                         : { type: String },
  updated_by                        : { type: Schema.Types.ObjectId },
},{timestamps: true, versionKey: false });

module.exports = mongoose.model('kw_settings', kw_settings);
