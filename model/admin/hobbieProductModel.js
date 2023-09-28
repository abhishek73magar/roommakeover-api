const knex = require("../../db");
const { removeFile } = require("../../libs/removeFile");

exports.addHobbieProductModel = (body, file) => {
  return new Promise(async(resolve, reject) => {
    const tnx = await knex.transaction();
    try {
      if(file) { body.thumbnail = `hobbie-products/` + file.originalname }
      let products = JSON.parse(body.products);
      delete body.products;

      const [hobbie_product] = await tnx('hobbie_products').insert(body).returning("id")
      
      products = products.map((product_id) => {
        return { product_id, hobbie_product_id: hobbie_product.id }
      })
      await tnx('hobbie_product_list').insert(products)

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
      if(file) { body.thumbnail = `hobbie-products/` + file.originalname }      
      const productList = await knex('hobbie_product_list').where('hobbie_product_id', id)
      let products = JSON.parse(body.products);

      const removeProduct = productList.reduce((prev, curr) => {
        const check = products.some(i => i.hobbie_product_id === curr.id);
        if(!check) { prev.push(curr.id) }
        return prev;
      }, [])
      
      const newProduct = products.reduce((prev, product_id) => {
        const check = productList.some(item => item.id === product_id)
        if(!check) { prev.push({ product_id, hobbie_product_id: id }) }
        return prev;
      }, [])

      if(Array.isArray(newProduct) && newProduct.length !== 0) await tnx('hobbie_product_list').where('id', removeProduct)
      if(Array.isArray(newProduct) && newProduct.length !== 0) await tnx('hobbie_product_list').insert(newProduct)
      
      delete body.products;
      await tnx('hobbie_products').update(body)

      await tnx.commit();
      return resolve("Hobbie Product updated")
    } catch (error) {
      if(file){ removeFile(`hobbie-products/${file.filename}`)}
      return reject(error)
    }
  })
}

exports.getHobbieProductModel = () => {
  return new Promise(async(resolve, reject) => {
    try {
      let query = `
          SELECT a.*, b.name as category FROM hobbie_products as a
          INNER JOIN categorys as b ON a.category_id=b.id
        `
      const { rows } = await knex.raw(query);
      return resolve(rows)
    } catch (error) {
      console.log(error)
      return reject(error)
    }
  })
}

exports.getHobbieProductByIdModel = (id) => {
  return new Promise(async(resolve, reject) => {
    try { 
      const [hobbieProduct] = await knex('hobbie_products').where('id', id)
      const query = `
          SELECT a.*, b.url,  from hobbie_product_list AS a
          INNER JOIN product_images AS b ON a.product_id=b.product_id 
          WHERE hobbie_product_id=?
        `
    const { rows } = await knex.raw(query, [id])
    const productList = rows.reduce((prev, curr) => {
    const check = prev.some((item) => item.product_id === curr.product_id)
    if(!check) prev.push(curr)
    return prev;
  }, [])
      return resolve({ hobbieProduct, productList })
    } catch (error) {
      console.log(error)
      return reject(error)
    }
  })
}

exports.deleteHobbieProductModel = (id) => {
  return knex('hoobie_product').where('id', id).delete()
}