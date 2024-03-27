const knex = require("../../db");
const { removeFile } = require("../../libs/removeFile");

exports.addDIYProductModel = (body, file) => {
  return new Promise(async(resolve, reject) => {
    const tnx = await knex.transaction();
    try {
      if(file) { body.thumbnail = `diy-products/${file.filename}` }
      let products = JSON.parse(body.products);
      delete body.products;

      const [diy_product] = await tnx('diy_products').insert(body).returning("id")
      if(Array.isArray(products) && products.length > 0){
        products = products.map((product_id) => ({ product_id, diy_id: diy_product.id }))
        await tnx('diy_product_list').insert(products)
      }
      
      await tnx.commit();
      return resolve("DIY Product added")
    } catch (error) {
      if(file){ removeFile(`diy-products/${file.filename}`)}
      console.log(error)
      return reject(error)
    }
  })
}

exports.updateDIYProductModel = (body, file, id) => {
  return new Promise(async(resolve, reject) => {
    const tnx = await knex.transaction();
    try {
      let products = JSON.parse(body.products);
      const [diy] = await knex('diy_products').select("thumbnail").where({ id })

      if(file) { body.thumbnail = `diy-products/${file.filename}` }      
      
      if(Array.isArray(products) && products.length > 0){
        const diyProductList = products.map((product_id) => ({ product_id, diy_id: id }))
        await tnx('diy_product_list').where('diy_id', id).delete()
        await tnx('diy_product_list').insert(diyProductList)
      }
      
      delete body.products;
      const [diyProduct] = await tnx('diy_products').where('id', id).update(body).returning("*")
      if(diy.thumbnail !== '') {
        if(body.thumbnail === '' || body.thumbnail !== diy.thumbnail) { removeFile(diy.thumbnail) }
      }

      await tnx.commit();
      return resolve({ ...diyProduct, products })
    } catch (error) {
      console.log(error)
      if(file){ removeFile(`diy-products/${file.filename}`)}
      return reject(error)
    }
  })
}

exports.getDIYProductModel = () => {
  return knex("diy_products").orderBy("id", "DESC")
}

exports.getDIYProductByIdModel = async(id) => {
  try { 
    const query = `
      SELECT *, (
        SELECT json_agg(product_id) FROM diy_product_list dpl WHERE dpl.diy_id=dp.id
      ) AS products FROM diy_products dp WHERE dp.id=?
    `
    const { rows } = await knex.raw(query, [id])
    if(rows.length === 0) return null
    return rows[0]
  } catch (error) {
    console.log(error)
    return Promise.reject(error)
  }
 
}

exports.deleteDIYProductModel = (id) => {
  return new Promise(async(resolve, reject) => {
    const tnx = await knex.transaction();
    try {
      const [diy] = await knex('diy_products').where('id', id)
      if(!diy) throw "diy product not found !"

      await tnx('diy_products').where('id', id).delete()
      removeFile(diy.thumbnail)

      await tnx.commit();
      return resolve('diy product removed')
      
    } catch (error) {
      await tnx.rollback();
      console.log(error)
      return reject(error)
    }
  })
}