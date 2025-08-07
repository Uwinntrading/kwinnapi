const mongoose = require('mongoose');

const kw_recharge_plans = new mongoose.Schema({
  ProviderCode: { type: String, required: true },
  SkuCode: { type: String, required: true, },
  LocalizationKey: { type: String, required: true, },
  SettingDefinitions: { type: [mongoose.Schema.Types.Mixed], default: [], },
  Maximum: { 
    CustomerFee: { type: Number, default: 0, },
    DistributorFee: { type: Number, default: 0, },
    ReceiveValue: { type: Number, required: true, },
    ReceiveCurrencyIso: { type: String, required: true,  },
    ReceiveValueExcludingTax: { type: Number, required: true, },
    TaxRate: { type: Number, default: 0, },
    SendValue: { type: Number, required: true, },
    SendCurrencyIso: { type: String, required: true, },
  },
  Minimum: { CustomerFee: { type: Number, default: 0, },
    DistributorFee: { type: Number, default: 0, },
    ReceiveValue: { type: Number, required: true, },
    ReceiveCurrencyIso: { type: String, required: true, },
    ReceiveValueExcludingTax: { type: Number, required: true, },
    TaxRate: { type: Number, default: 0, },
    SendValue: { type: Number, required: true, },
    SendCurrencyIso: { type: String, required: true, },
  },
  CommissionRate: { type: Number, default: 0.1, },
  ProcessingMode: { type: String, required: true, },
  RedemptionMechanism: { type: String, required: true, },
  Benefits: { type: [String], default: [], },
  ValidityPeriodIso: { type: String, default: "", },
  UatNumber: { type: String, required: true, },
  DefaultDisplayText: { type: String, required: true, },
  RegionCode: { type: String, required: true, },
  PaymentTypes: { type: [String], default: [], },
  LookupBillsRequired: { type: Boolean, default: false, },
  Details : {
    DisplayText : {type : String},
    DescriptionMarkdown : {type : String},
    ReadMoreMarkdown : {type : String},
    LocalizationKey : {type : String},
    LanguageCode : {type : String},
  }
}, { timestamps: true });

module.exports = mongoose.model('kw_recharge_plans', kw_recharge_plans);
