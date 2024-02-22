const knex = require("../../db");
const { removeFile } = require("../../libs/removeFile");

exports.addHobbieProductModel = (body, file) => {
  return new Promise(async(resolve, reject) => {
    const tnx = await knex.transaction();
    try {
      if(file) { body.thumbnail = `hobbie-products/${file.filename}` }
      let products = JSON.parse(body.products);
      delete body.products;

      const [hobbie_product] = await tnx('hobbie_products').insert(body).returning("id")
      
      products = products.map((product_id) => {
        return { product_id, hobbie_product_id: hobbie_product.id }
      })
     if(Array.isArray(products) && products.length !== 0) await tnx('hobbie_product_list').insert(products)

      await tnx.commit();
      return resolve("Hobbie Product added")
    } catch (error) {
      if(file){ removeFile(`hobbie-products/${file.filename}`)}
      console.log(error)
      return reject(error)
    }
  })
}

exports.updateHobbieProductModel = (body, file, id) => {
  return new Promise(async(resolve, reject) => {
    const tnx = await knex.transaction();
    try {
      let products = JSON.parse(body.products);
      const [hobbie] = await knex('hobbie_products').select("thumbnail").where({ id })

      if(file) { body.thumbnail = `hobbie-products/${file.filename}` }    

      if(Array.isArray(products) && products.length > 0){
        const diyProductList = products.map((product_id) => ({ product_id, hobbie_product_id: id }))
        await tnx('hobbie_product_list').where('hobbie_product_id', id).delete()
        await tnx('hobbie_product_list').insert(diyProductList)
      }

      delete body.products;
      const [hobbieProduct] = await tnx('hobbie_products').where('id', id).update(body).returning('*')
      console.log(body.thumbnail, hobbie.thumbnail)
      if(hobbie.thumbnail !== '') {
        if(body.thumbnail === '' || body.thumbnail !== hobbie.thumbnail) { removeFile(hobbie.thumbnail) }
      }

      await tnx.commit();
      return resolve({ ...hobbieProduct, products })
    } catch (error) {
      console.log(error)
      if(file){ removeFile(`hobbie-products/${file.filename}`)}
      return reject(error)
    }
  })
}

exports.getHobbieProductModel = () => {
  return knex('hobbie_products').orderBy('id', 'desc')
}

exports.getHobbieProductByIdModel = async(id) => {
    try { 
      const query = `
        SELECT *, (
          SELECT json_agg(product_id) FROM hobbie_product_list hpl WHERE hpl.hobbie_product_id=hp.id
        ) AS products FROM hobbie_products hp WHERE hp.id=?
      `
      const { rows } = await knex.raw(query, [id])
      if(rows.length === 0) return null
      return rows[0]
    } catch (error) {
      console.log(error)
      return Promise.reject(error)
    }
}

exports.deleteHobbieProductModel = async(id) => {
  try {
    const [hobbieProduct] = await knex('hobbie_products').where('id', id).delete().returning("*")
    if(hobbieProduct.thumbnail && hobbieProduct.thumbnail !== '') removeFile(hobbieProduct.thumbnail)
    return "Hobbie Product Removed"
  } catch (error) {
    console.log(error)
    return Promise.reject(error)
  } 
}