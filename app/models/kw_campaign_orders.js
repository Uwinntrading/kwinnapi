const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const kw_campaign_orders = new Schema({
    order_no            : { type : String, required : true, trim : true, unique : true },
    verification_code   : { type : Number, required : true, trim : true},
    campaign_title      : { type: String, required : true, trim : true },
    campaign_data       : { type: Schema.Types.ObjectId, required : true, trim : true },
    draw_date_time      : { type : Date, required : true, trim : true},
    draw_Data           : { type: Schema.Types.ObjectId, required : true, trim : true },

    seller_user_id      : { type : Schema.Types.ObjectId, required : true, trim : true},
    seller_first_name   : { type : String, required : true, trim : true},
    seller_last_name    : { type : String,  trim : true},
    seller_mobile       : { type : Number, required : true, trim : true},
    seller_pos_number   : { type : Number, required : true, trim : true},
    area                : { type : String, required : true, trim : true},

    straight            : {
        points      : { type : Number, trim : true},
        qty         : { type : Number, trim : true},
        total_points: { type : Number, trim : true}
    },
                          
    rumble         : {
        points      : { type : Number, trim : true},
        qty         : { type : Number, trim : true},
        total_points: { type : Number, trim : true}
    },

    chance         : {
        points      : { type : Number, trim : true},
        qty         : { type : Number, trim : true},
        total_points: { type : Number, trim : true}
    },

    bind_person_name        : { type : String, trim : true},
    bind_person_mobile      : { type : Number, trim : true},
    commission_percentage   : { type : Number, trim : true},
    
    ticket              : [ { type : Schema.Types.ObjectId, trim : true} ],
    prize               : { type : String, trim : true},
    total_qty           : { type : Number, required : true, trim : true},
    total_points        : { type : Number, required : true, trim : true},

    payment_mode        : { type : String, required : true, trim : true},
    is_print            : { type : String, required : true, trim : true, default : 'N'},
    creation_ip         : { type : String,  trim : true },
    created_by          : { type: Schema.Types.ObjectId },
    
    update_ip           : { type : String, trim : true },
    update_by           : { type: Schema.Types.ObjectId },

    status              : { type: String, required : true, trim :true }
}, {timestamps: true});

module.exports = mongoose.model('kw_campaign_orders', kw_campaign_orders);
