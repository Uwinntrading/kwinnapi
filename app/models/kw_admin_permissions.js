const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const kw_admin_permission = new Schema({
  
  module_id             : { type: Number, required: true },
  admin_id              : { type: Number, required: true },
  module_name           : { type: String, required: true },
  module_display_name   : { type: String, required: true },
  module_orders         : { type: String, required: true , unique :false },
  module_icone          : { type: String, required: true },

  view_data             : { type: String, required: true },
  add_data              : { type: String, required: true },
  edit_data             : { type: String ,required: true },
  delete_data           : { type: String ,required: true },
  first_data            : { type: Array ,required: true },
  
  status                : { type: String ,required: true , enum: ['A','I','D'], defalut: 'A'},
  created_ip            : { type: String },
  created_by            : { type: Schema.Types.ObjectId },
  update_ip             : { type: String },
  updated_by            : { type: Schema.Types.ObjectId },
},{timestamps: true, versionKey: false ,  collection: 'kw_admin_permissions' });

module.exports = mongoose.model('kw_admin_permission', kw_admin_permission);
