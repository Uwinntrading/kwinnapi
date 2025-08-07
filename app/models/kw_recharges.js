const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const kw_recharges = new Schema({   
    TransferRef     : { type: String, trim : true },
    DistributorRef  : { type: String, trim : true },
    SkuCode         : { type: String, trim : true },
    Price           : {
                        CustomerFee : { type: Number, trim : true },
                        DistributorFee : { type: Number, trim : true },
                        ReceiveValue : { type: Number, trim : true },
                        ReceiveCurrencyIso : { type: String, trim : true },
                        ReceiveValueExcludingTax : { type: Number, trim : true },
                        TaxRate : { type: Number, trim : true },
                        SendValue : { type: Number, trim : true },
                        SendCurrencyIso : { type: String, trim : true },
                    },
    rechargeData      : { type: Array, trim : true },
    CommissionApplied : { type: Number, trim : true },
    ProcessingState   : { type: String, trim : true },
    AccountNumber     : { type: Number, trim : true },
    ProviderCode      : { type: String, trim : true },
    providerName      : { type: String, trim : true },
    providerLogo      : { type: String, trim : true },
    providerData      : { type: String, trim : true },
    markUpValue       : { type: Number, trim : true },
    commission        : { type: Number, trim : true },
    status            : { type: String, trim : true },
    creation_ip       : { type: String, trim : true },
    created_by        : { type: Schema.Types.ObjectId, trim : true },
    update_ip         : { type: String, trim : true },
    updated_by        : { type: String, trim : true },
    rechargeData      : [ { type : Schema.Types.ObjectId, trim : true} ],

},{timestamps: true, collection: 'kw_recharges'});

module.exports = mongoose.model('kw_recharges', kw_recharges);