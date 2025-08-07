const productsModal = require('../../../../models/kw_products');

/**********************************************************************
 * Function Name    :   select
 * Purposs          :   This function is used to get user data by condition.
 * Created By       :   Dilip Halder
 * Created Data     :   15-October-2024
 **********************************************************************/
exports.select = async function (options) {
    try {
      const { type, condition, select, sort, skip, limit } = options;
      if(type === 'count'){
        return await productsModal.countDocuments(condition);
      } else if(type === 'single'){
        return await productsModal.findOne(condition).select(select);
      } else {
        return await productsModal.find(condition).select(select).sort(sort).skip(skip).limit(limit);
      }
    } catch (error) {
      return Promise.reject(error);
    }
}//End of Function

/**********************************************************************
 * Function Name    :   selectWithPopulate
 * Purposs          :   This function is used to get user data by condition.
 * Created By       :   Dilip Halder
 * Created Data     :   15-October-2024
 **********************************************************************/
exports.selectWithPopulate = async function (options) {
  try {
    const { type, condition, select, sort, skip, limit } = options;
    if(type === 'count'){
      return await productsModal.countDocuments(condition);
    } else if(type === 'single'){
      return await productsModal.findOne(condition).select(select)
      .populate([
        {
          path : 'prize_data',
          model : 'kw_prize',
          select : ''
        },
      ]);
    } else {
      return await productsModal.find(condition).select(select)
      .populate([
        {
          path : 'prize_data',
          model : 'kw_prize',
          select : ''
        },
      ])
      .sort(sort).skip(skip).limit(limit);
    }
  } catch (error) {
    return Promise.reject(error);
  }
}//End of Function
/**********************************************************************
 * Function Name    :   selectWithPopulate
 * Purposs          :   This function is used to get user data by condition.
 * Created By       :   Dilip Halder
 * Created Data     :   15-October-2024
 **********************************************************************/
exports.getDataById = async function (id) {
  try {
    return productsModal.findById(id);
  } catch (error) {
    return Promise.reject(error);
  }
}//End of Function