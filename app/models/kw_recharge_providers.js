const mongoose = require('mongoose');

const kw_recharge_providers = new mongoose.Schema({
    ProviderCode: { type: String, required: true },
    CountryIso: { type: String, required: true },
    Name: { type: String, required: true },
    ValidationRegex: { type: String, required: true },
    RegionCodes: { type: [String],  required: true },
    PaymentTypes: { type: [String],  required: true },
    LogoUrl: { type: String }
},{timestamps: true, versionKey: false });

module.exports = mongoose.model('kw_recharge_providers', kw_recharge_providers);
