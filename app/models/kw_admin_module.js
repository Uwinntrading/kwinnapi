const { string } = require('joi');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const kw_admin_module = new Schema({
  module_id             : { type: Number , required : true },
  module_name           : { type: String },
  module_display_name   : { type: String , required : true },
  module_orders         : { type: String , required : true },
  module_icone          : { type: String , required : true },
  first_data            : { type: Array , required : true },
  
  created_ip          : { type: String , trim : true },
  update_ip           : { type: String , trim : true },
  created_by          : { type: Schema.Types.ObjectId , trim : true },
  updated_by          : { type: Schema.Types.ObjectId , trim : true },
  status              : { type: String , enum : ["A","I","D"], default : "A" },
},{ timestamps: true ,collection: 'kw_admin_module', versionKey: false });

module.exports = mongoose.model('kw_admin_module', kw_admin_module);
