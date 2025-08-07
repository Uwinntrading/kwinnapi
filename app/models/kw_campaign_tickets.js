const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const kw_campaign_tickets = new Schema({
    order_id            : { type : Schema.Types.ObjectId, trim : true, required : true },
    order_no            : { type : String, trim : true, required : true },

    campaign_title      : { type: String, required : true, trim : true },
    campaign_data       : { type: Schema.Types.ObjectId, required : true, trim : true },

    seller_user_id      : { type : Schema.Types.ObjectId, required : true, trim : true},
    seller_first_name   : { type : String, required : true, trim : true},
    seller_last_name    : { type : String,  trim : true},
    seller_mobile       : { type : Number, required : true, trim : true},
    seller_pos_number   : { type : Number, required : true, trim : true},
    
    type                : { type : String, required : true, trim : true},
    points              : { type : Number, required : true, trim : true},
    ticket              : { type : String, required : true, trim : true},
    
    creation_ip         : { type : String,  trim : true },
    created_by          : { type: Schema.Types.ObjectId },
    
    update_ip           : { type : String, trim : true },
    update_by           : { type: Schema.Types.ObjectId },

    status              : { type: String, required : true, trim :true }
}, {timestamps: true});

module.exports = mongoose.model('kw_campaign_tickets', kw_campaign_tickets);
