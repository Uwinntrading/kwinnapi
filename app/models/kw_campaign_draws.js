const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const kw_campaign_draws = new Schema({
    seq_id : { type : Number, required : true, trim : true },
    campaign_data : { type: Schema.Types.ObjectId, required : true, trim : true },
    draw_date : { type : Date,  trim : true },
    draw_time : { type : String,  trim : true },
    draw_date_time : { type : Date,  trim : true },
       
    status: { type: String, enum: ["A","I","D","C"], default: "A" },

    creation_ip : { type : String,  trim : true },
    created_by : { type: Schema.Types.ObjectId },

    update_ip : { type : String, trim : true },
    update_by : { type: Schema.Types.ObjectId }

}, {timestamps: true, versionKey: false});

module.exports = mongoose.model('kw_campaign_draws', kw_campaign_draws);
