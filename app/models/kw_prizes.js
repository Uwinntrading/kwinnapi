const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const kw_prizes = new Schema({
    seq_id : { type : Number, required : true, trim : true },
    campaign_data : { type: Schema.Types.ObjectId,  },
    enable_title : { type : String,  enum : ["Y","N"], default : "N" }, 
    title : { type : String, trim : true },
    description : { type : String, required : true, trim : true },
    image : { type : String, required : true, trim : true },  
    image_alt : { type : String, trim : true },  
    lotto_type : { type : Number, trim : true },
    enable_straight_prize_heading : { type : String, enum : ["Y","N"], default : "N", trim : true },
    straight_prize_heading : { type : String, trim : true },
    straight_shared_prize : { type : Array, trim : true },
    straight_prize1 : { type : Number, trim : true },
    straight_prize2 : { type : Number, trim : true },
    straight_prize3 : { type : Number, trim : true },
    straight_prize4 : { type : Number, trim : true },
    straight_prize5 : { type : Number, trim : true },
    straight_prize6 : { type : Number, trim : true },
    straight_prize7 : { type : Number, trim : true },

    enable_rumble_prize_heading : { type : String, enum : ["Y","N"], default : "N", trim : true },
    rumble_prize_heading : { type : String, trim : true },
    rumble_shared_prize : { type : Array, trim : true },
    rumble_prize1 : { type : Number, trim : true },
    rumble_prize2 : { type : Number, trim : true },
    rumble_prize3 : { type : Number, trim : true },
    rumble_prize4 : { type : Number, trim : true },
    rumble_prize5 : { type : Number, trim : true },
    rumble_prize6 : { type : Number, trim : true },
    rumble_prize7 : { type : Number, trim : true },

    enable_chance_prize_heading : { type : String, enum : ["Y","N"], default : "N", trim : true },
    chance_prize_heading : { type : String, trim : true },
    chance_shared_prize : { type : Array, trim : true },
    chance_prize1 : { type : Number, trim : true },
    chance_prize2 : { type : Number, trim : true },
    chance_prize3 : { type : Number, trim : true },
    chance_prize4 : { type : Number, trim : true },
    chance_prize5 : { type : Number, trim : true },
    chance_prize6 : { type : Number, trim : true },
    chance_prize7 : { type : Number, trim : true },

    creation_ip : { type : String,  trim : true },
    created_by : { type: Schema.Types.ObjectId },

    update_ip : { type : String, trim : true },
    update_by : { type: Schema.Types.ObjectId },

    status: { type: String, enum: ["A","I","D"], default: "A" }
}, {timestamps: true, versionKey: false});

module.exports = mongoose.model('kw_prizes', kw_prizes);
