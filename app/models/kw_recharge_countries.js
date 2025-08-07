const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const kw_recharge_countries = new Schema({
    CountryIso                      : { type: String, required:true, trim : true, unique :true },
    CountryName                     : { type: String, required:true, trim : true },
    InternationalDialingInformation : [{
                                        Prefix : { type: String, required: true },
                                        MinimumLength : { type: Number, required: true },
                                        MaximumLength : { type: Number, required: true },
                                    }],
    RegionCodes                     : [{ type: String, trim: true }],
    flag                            : { type: String, default : "" }
},{timestamps: true, versionKey: false });

module.exports = mongoose.model('kw_recharge_countries', kw_recharge_countries);
