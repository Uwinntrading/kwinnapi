const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const kw_campaigns = new Schema({
    seq_id : { type : Number, required : true, trim : true },
    title : { type : String, required : true, trim : true },
    slug : { type : String, required : true, trim : true },
    description : { type : String, required : true, trim : true },
    
    image : { type : String, trim : true },
    product_image : { type : String, trim : true },
    prizeData : { type: Schema.Types.ObjectId },
    settingData : { type: Schema.Types.ObjectId },
    
    category : { type : String, required : true, trim : true },
    sub_category : { type : String, required : true, trim : true },

    straight_add_on_amount : { type : Number, trim : true },
    rumble_add_on_amount : { type : Number, trim : true },
    chance_add_on_amount : { type : Number, trim : true },

    countdown_status : { type : String, trim : true },

    lotto_type : { type : Number, trim : true },

    draw_date   : { type : Date, trim : true },
    draw_time   : { type : String, trim : true },
    draw_date_time : { type : Date, trim : true },
    draw_id     : { type: Schema.Types.ObjectId },

    enable_number_range_prefix : { type: String, enum: ["Y","N"], default: "N" },
    number_range_prefix : { type: Number, trim : true },

    ticket_number_repeat : { type: String, enum: ["Y","N"], default: "N" },

    lotto_range_prefix : { type: String, enum: ["Y","N"], default: "N" },
    
    lotto_range_start : { type : Number, trim : true },
    lotto_range_end : { type : Number, trim : true },

    show_on : { type : Array, trim : true },
    seq_order: { type : Number, trim : true },
     
    creation_ip : { type : String,  trim : true },
    created_by : { type: Schema.Types.ObjectId },

    update_ip : { type : String, trim : true },
    update_by : { type: Schema.Types.ObjectId },

    status: { type: String, enum: ["A","I","D"], default: "A" }
}, {timestamps: true, versionKey: false});

module.exports = mongoose.model('kw_campaigns', kw_campaigns);
