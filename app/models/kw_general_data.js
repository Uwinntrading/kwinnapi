const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const kw_general_data = new Schema({   
    general_data_id : { type: Number, trim : true , required : true },
    alt_text        : { type: String, trim : true },
    email_id        : { type: String, trim : true },
    contact_no      : { type: String, trim : true },
    address         : { type: String, trim : true },
    facebook_link   : { type: String, trim : true },
    linkedin_link   : { type: String, trim : true },
    twitter_link    : { type: String, trim : true },
    insta_link      : { type: String, trim : true },
    you_tube        : { type: String, trim : true },
    slider_type     : { type: String, trim : true },
    whatsapp_no     : { type: String, trim : true },
    android_version : { type: String, trim : true },
    ios_version     : { type: String, trim : true },
    logo            : { type: String, trim : true },
    website         : { type: String, trim : true },
    markup_commission: { type: String, trim : true },
    choose_coupon   : { type: String, trim : true },
    whatsapp_authorization_key  : { type: String, trim : true },
    app_url                     : { type: String, trim : true },
    draw_time_end               : { type: String, trim : true },
    draw_time_start             : { type: String, trim : true },
    delivery_charge             : { type: String, trim : true },
    drawdata_pin                : { type: String, trim : true },
    comming_soon_pro_btn        : { type: String, trim : true },
    comming_soon_text           : { type: String, trim : true },
    home_botttom_slider_header  : { type: String, trim : true },
    prize_title                 : { type: String, trim : true },
    enable_u_points_in_pos      : { type: String, trim : true },
    analyser_start_time         : { type: String, trim : true },
    analyser_end_time           : { type: String, trim : true },
    invoice_start_time          : { type: String, trim : true },
    invoice_end_time            : { type: String, trim : true },
    lotto_coupon_selection      : { type: String, trim : true, default : "Y" },
    status                      : { type: String, enum : ["A","I","D"], default : "A" },
   
    creation_ip                 : { type: String, trim : true },
    update_ip                   : { type: String, trim : true },
    created_by                  : { type: Schema.Types.ObjectId, trim : true },
    updated_by                  : { type: Schema.Types.ObjectId, trim : true },

},{timestamps: true, collection: 'kw_general_data' , versionKey:false });

module.exports = mongoose.model('kw_general_data', kw_general_data);