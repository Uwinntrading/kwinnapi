const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Invoices = new Schema({
  
    invoice_no          : { type: Number, required: true, trim: true },
    batch_no            : { type: Number, trim: true },
    invoice_date        : { type: Date, required: true, trim: true },
    
    users_id            : { type: Number, trim: true },
    users_oid           : { type: Schema.Types.ObjectId, trim: true },
    store               : { type: String, required: true, trim: true },        
    users_name          : { type: String, required: true, trim: true },
    area                : { type: String, trim: true },
    
    sales_person_name   : { type: String, trim: true },
    
    users_mobile        : { type: Number, required: true, trim: true },
    pos_device_id       : { type: String, trim : true },
    pos_number          : { type: Number, trim : true },
    payment_mode        : { type: String, trim : true },

    start_date          : { type: String, required: true, trim : true },
    end_date            : { type: String, required: true, trim : true },
    
    start_time          : { type: String, trim : true },
    end_time            : { type: String, trim : true },
    
    due_date            : { type: Date, required: true, trim : true },

    lottoTotalSales     : { type: Number, trim: true, default : 0 },
    lottoTotalCommission : { type: Number, trim: true, default : 0 },
    lottoPaidAmount     : { type: Number, trim: true, default : 0 },
    lottoIncentives     : { type: Number, trim: true, default : 0 },
    
    rechargeTotalSales    : { type: Number, trim: true, default : 0 },
    rechargeTotalCommission : { type: Number, trim: true, default : 0 },
    rechargePaidAmount    : { type: Number, trim: true, default : 0 },
    rechargeIncentives     : { type: Number, trim: true, default : 0 },

    total_sales         : { type: Number, trim: true },
    total_commission    : { type: Number, trim: true },
    total_paid          : { type: Number, trim: true },
    total_incentives    : { type: Number, trim: true },
    total_due           : { type: Number, trim: true },

    old_pending_balance : { type: Number, trim: true },
    other_charges       : { type: Number, trim: true },
    sub_total_due       : { type: Number, trim: true },

    add_in_due          : { type: String, trim: true, default : 'N' },

    created_by          : { type: Schema.Types.ObjectId, trim: true },
    created_ip          : { type: String, trim : true },
    
    updated_by          : { type: Schema.Types.ObjectId, trim: true },
    update_ip           : { type: String, trim : true },
    status              : { type: String, default: "A" }, //A-Active, I-Inactive, B-Block, D-Delete
    
    remarks             : { type: String, trim : true } 
}, {timestamps: true});

module.exports = mongoose.model('kw_invoices', Invoices);
