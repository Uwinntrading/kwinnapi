const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const admin_permissions = new Schema({
    admin_id : { type: Schema.Types.ObjectId, ref: "admins" },
    customer_due : { 
        customer_list : { type: String, enum: ["Y","N"], default: "N" } 
    },

    invoice : { 
        individual : { type: String, enum: ["Y","N"], default: "N" },
        bulk_request : { type: String, enum: ["Y","N"], default: "N" } 
    },
    analyser : { 
        list : { type: String, enum: ["Y","N"], default: "N" }
    }

}, {timestamps: true});

module.exports = mongoose.model('crm_admin_permissions', admin_permissions);
