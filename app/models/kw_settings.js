const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const kw_settings = new Schema({
    seq_id : { type : Number, required : true, trim : true },
    setting_type : { type : String,  enum : ["Global","Campaign"], default : "Campaign" },
    campaign_data : { type: Schema.Types.ObjectId, trim : true },

    straight_game_name : { type : String, trim : true },
    straight_settings : { type : String, enum : ["Enable","Disable"], default : "Disable", trim : true },
    straight_settings_default_check : { type : String, enum : ["Checked","Unchecked"], default : "Unchecked", trim : true },

    rumble_game_name : { type : String, trim : true },
    rumble_settings : { type : String, enum : ["Enable","Disable"], default : "Disable", trim : true },
    rumble_settings_default_check : { type : String, enum : ["Checked","Unchecked"], default : "Unchecked", trim : true },

    chance_game_name : { type : String, trim : true },
    chance_settings : { type : String, enum : ["Enable","Disable"], default : "Disable", trim : true },
    chance_settings_default_check : { type : String, enum : ["Checked","Unchecked"], default : "Unchecked", trim : true },

    freezing_title               : { type : String, trim : true },
    campaign_auto_freezing_mode  : { type : String, enum : ["Enable","Disable"], default : "Disable", trim : true },
    campaign_freezing_start_time : { type : String, trim : true },
    campaign_freezing_end_time   : { type : String, trim : true },
    manual_freezing              : { type : String, trim : true },

    game_rule_image : { type : String, trim : true },
    game_description : { type : String, trim : true },

    creation_ip : { type : String,  trim : true },
    created_by : { type: Schema.Types.ObjectId },

    update_ip : { type : String, trim : true },
    update_by : { type: Schema.Types.ObjectId },

    status: { type: String, enum: ["A","I","D"], default: "A" }
}, {timestamps: true, versionKey: false});

module.exports = mongoose.model('kw_settings', kw_settings);
