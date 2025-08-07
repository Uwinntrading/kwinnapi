const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const kw_counters = new Schema({
    table        : { type: String, required: true, trim: true },
    seq        : { type: Number, required: true, trim: true },
    seq_id     : { type: String, trim: true },
    encrypted  : { type: Number, required: true, trim: true },
})
module.exports = mongoose.model('kw_counters', kw_counters); 