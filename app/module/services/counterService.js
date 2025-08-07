const Counter = require('../../models/counter');
const campaignOrderModel = require('../../models/kw_campaign_orders');

exports.getSequence = async function (tableName, type=''){
  try {
    let encryptValue
    let newId
    let seq_id = '';
    const result = await Counter.findOne({ table: tableName });
    if(result){
      newId = result.seq + 1;
      encryptValue = newId;
      if(type){
        switch (type) {
          case 'Users':
            seq_id = `CS${newId}`;  
            break;
          case 'Sales Person':
            seq_id = `SR${newId}`;  
            break;
          case 'Retailer':
            seq_id = `RT${newId}`;  
            break;
          case 'Freelancer':
            seq_id = `FL${newId}`;  
            break;              
          case 'lotto_products':
            seq_id = `LP${newId}`;  
            break;              
          case 'Api User':
            seq_id = `AU${newId}`;  
            break;
          default:
            seq_id = ''
            break;
        }
      }
      const condition = { _id: result._id };
      const data = {
        seq: newId, 
        encrypted: encryptValue, 
        ...(seq_id?{seq_id : seq_id}:null)
      }
      return await Counter.findByIdAndUpdate( condition, data, {new: true} );
    } else {
      newId = 1001;
      if(type){
        switch (type) {
          case 'Users':
            seq_id = `CS${newId}`;  
            break;
          case 'Sales Person':
            seq_id = `SR${newId}`;  
            break;
          case 'Retailer':
            seq_id = `RT${newId}`;  
            break;
          case 'Freelancer':
            seq_id = `FL${newId}`;  
            break;              
          case 'lotto_products':
            seq_id = `LP${newId}`;  
            break;              
          case 'Api User':
            seq_id = `AU${newId}`;  
            break;
          default:
            seq_id = ''
            break;
        }
      }
      const params = {
        table: tableName, 
        seq: 1001, 
        encrypted: 1001,
        seq_id : seq_id
      }
      return await Counter.create(params);
    }
  } catch (error) {
    console.log(error);
    return false;
  }
}

exports. getUserSeqId = async function (tableName){

}

exports.getOrerId = async function (tableName){
  return new Promise((resolve, reject) => {
    let encryptValue
    let newId
    Counter.findOne({ table: tableName })
      .then(result => {
        if (result) {
          newId = result.seq + 1;
          encryptValue = newId;
          return Counter.updateOne(
            { table: tableName },
            { $set: { seq: newId, encrypted: encryptValue } }
          );
        } else {
          newId = 101;
          encryptValue = newId;
          return Counter.create({
            table: tableName,
            seq: newId,
            encrypted: encryptValue
          });
        }
      })
      .then(() => resolve(encryptValue))
      .catch(error => reject(error));
  });
}
/****** This function is used for genetate booking seq id ****** */
exports.getBookingId = async function (tableName){
  return new Promise((resolve, reject) => {
    let encryptValue
    let newId
    Counter.findOne({ _id: tableName })
      .then(result => {
        if (result) {
          newId = result.seq + 1;
          encryptValue = newId;
          return Counter.updateOne(
            { _id: tableName },
            { $set: { seq: newId, encrypted: encryptValue } }
          );
        } else {
          newId = 10001;
          encryptValue = newId;
          return Counter.create({
            _id: tableName,
            seq: newId,
            encrypted: encryptValue
          });
        }
      })
      .then(() => resolve(encryptValue))
      .catch(error => reject(error));
  });
}



/*******************************************************
 * ******************** Get campaign order number *****************
 ********************************************************/
exports.getCampaignOrderNumber = async function () {
  try {
    let order_number = '';
    let isAvailable;
    do {
      order_number = Math.floor(10000000 + Math.random() * 99999990);
      const condition = { order_no: `KWIN${order_number}` };
      isAvailable = await campaignOrderModel.find(condition).countDocuments();
    } while (isAvailable !== 0);
    
    return `KWIN${order_number}`; 
  } catch (error) {
    console.log('error', error);
    return ''; 
  }
}
exports.getInvoiceNo = async function (tableName='invoices'){
  return new Promise((resolve, reject) => {
    let encryptValue
    let newId
    Counter.findOne({ table: tableName })
      .then(result => {
        if (result) {
          newId = result.seq + 1;
          encryptValue = newId;
          return Counter.updateOne(
            { table: tableName },
            { $set: { seq: newId, encrypted: encryptValue } }
          );
        } else {
          newId = 1001;
          encryptValue = newId;
          return Counter.create({
            table: tableName,
            seq: newId,
            encrypted: encryptValue
          });
        }
      })
      .then(() => resolve(encryptValue))
      .catch(error => reject(error));
  });
}

exports.getBatchNo = async function (tableName='invoice-request'){
  return new Promise((resolve, reject) => {
    let encryptValue
    let newId
    Counter.findOne({ table: tableName })
      .then(result => {
        if (result) {
          newId = result.seq + 1;
          encryptValue = newId;
          return Counter.updateOne(
            { table: tableName },
            { $set: { seq: newId, encrypted: encryptValue } }
          );
        } else {
          newId = 1001;
          encryptValue = newId;
          return Counter.create({
            table: tableName,
            seq: newId,
            encrypted: encryptValue
          });
        }
      })
      .then(() => resolve(encryptValue))
      .catch(error => reject(error));
  });
}

exports.getTransactionNo = async function (tableName='crm_transactions'){
  return new Promise((resolve, reject) => {
    let encryptValue
    let newId
    Counter.findOne({ table: tableName })
      .then(result => {
        if (result) {
          newId = result.seq + 1;
          encryptValue = newId;
          return Counter.updateOne(
            { table: tableName },
            { $set: { seq: newId, encrypted: encryptValue } }
          );
        } else {
          newId = 1001;
          encryptValue = newId;
          return Counter.create({
            table: tableName,
            seq: newId,
            encrypted: encryptValue
          });
        }
      })
      .then(() => resolve(encryptValue))
      .catch(error => reject(error));
  });
}

