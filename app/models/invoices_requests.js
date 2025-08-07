const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const invoices_requests = new Schema({
    batch_no            : { type: Number, required: true, trim: true },
    invoice_date        : { type: Date, required: true, trim: true },
    
    users_id            : { type: Number, trim: true },
    users_oid           : { type: Schema.Types.ObjectId, trim: true },
    store               : { type: String, required: true, trim: true },        
    users_name          : { type: String, required: true, trim: true },
    users_mobile        : { type: Number, required: true, trim: true },
    payment_mode        : { type: String, trim : true },

    start_date          : { type: String, required: true, trim : true },
    end_date            : { type: String, required: true, trim : true },

    start_time          : { type: String, trim : true },
    end_time            : { type: String, trim : true },

    due_date            : { type: Date, required: true, trim : true },

    invoice_number      : { type: Number, trim : true },
    add_in_due          : { type: String, trim: true, default : 'N' },

    created_by          : { type: Schema.Types.ObjectId, trim: true },
    created_ip          : { type: String, trim : true },
    
    updated_by          : { type: Schema.Types.ObjectId, trim: true },
    update_ip           : { type: String, trim : true },

    status              : { type: String, enum: ["Pending","Fail","Complete"], default: "Pending" }
}, {timestamps: true});

module.exports = mongoose.model('kw_invoices_requests', invoices_requests);
