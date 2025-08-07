const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const kw_prize = new Schema({   
    prize_id     : { type: Number, trim : true },
    p_oid        : {type : Schema.Types.ObjectId, require : true, ref: "kw_products" , unique : true },
    enable_title : { type: String, enum:['Y','N'], default : 'Y' },
    title        : { type: String, trim : true },
    title_slug   : { type: String, trim : true },
    description  : { type: String, trim : true },

    enable_stright_prize_heading : { type: String, enum:['Y','N'], default : 'N' },
    stright_prize_heading : { type: String, trim : true },
    stright_prize_type : { type: Array, trim : true },
    stright_prize1 : { type: Number, trim : true },
    stright_prize2 : { type: Number, trim : true },
    stright_prize3 : { type: Number, trim : true },
    stright_prize4 : { type: Number, trim : true },
    stright_prize5 : { type: Number, trim : true },
    stright_prize6 : { type: Number, trim : true },
    stright_prize7 : { type: Number, trim : true },

    enable_rumble_mix_prize_heading : { type: String, enum:['Y','N'], default : 'N' },
    rumble_mix_prize_heading : { type: String, trim : true },
    rumble_mix_prize_type : { type: Array, trim : true },
    rumble_mix_prize1 : { type: Number, trim : true },
    rumble_mix_prize2 : { type: Number, trim : true },
    rumble_mix_prize3 : { type: Number, trim : true },
    rumble_mix_prize4 : { type: Number, trim : true },
    rumble_mix_prize5 : { type: Number, trim : true },
    rumble_mix_prize6 : { type: Number, trim : true },
    rumble_mix_prize7 : { type: Number, trim : true },


    enable_reverse_prize_heading : { type: String, enum:['Y','N'], default : 'N' },
    reverse_prize_heading : { type: String, trim : true },
    reverse_prize_type : { type: Array, trim : true },
    reverse_prize1 : { type: Number, trim : true },
    reverse_prize2 : { type: Number, trim : true },
    reverse_prize3 : { type: Number, trim : true },
    reverse_prize4 : { type: Number, trim : true },
    reverse_prize5 : { type: Number, trim : true },
    reverse_prize6 : { type: Number, trim : true },
    reverse_prize7 : { type: Number, trim : true },

    lotto_type : { type: Number, trim : true },
    prize_image : { type: String, trim : true },
    prize_image_alt : { type: String, trim : true },

    status : { type: String, enum : ["A","I","D"], default : "A" },
    
    creation_ip : { type: String, trim : true },
    created_by : { type: String, trim : true },
    update_ip : { type: String, trim : true },
    updated_by : { type: String, trim : true }

},{timestamps: true, collection: 'kw_prize'});

module.exports = mongoose.model('kw_prize', kw_prize);