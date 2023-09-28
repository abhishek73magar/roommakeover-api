const knex = require("../../db");
const { removeFile } = require("../../libs/removeFile");

exports.addDIYProductModel = (body, file) => {
  return new Promise(async(resolve, reject) => {
    const tnx = await knex.transaction();
    try {
      if(file) { body.thumbnail = `DIY-products/` + file.originalname }
      let products = JSON.parse(body.products);
      delete body.products;

      const [diy_product] = await tnx('diy_products').insert(body).returning("id")
      
      products = products.map((product_id) => {
        return { product_id, diy_product_id: diy_product.id }
      })
      await tnx('diy_product_list').insert(products)

      await tnx.commit();
      return resolve("DIY Product added")
    } catch (error) {
      if(file){ removeFile(`DIY-products/${file.filename}`)}
      console.log(error)
      return reject(error)
    }
  })
}

exports.updateDIYProductModel = (body, file, id) => {
  return new Promise(async(resolve, reject) => {
    const tnx = await knex.transaction();
    try {
      if(file) { body.thumbnail = `DIY-products/` + file.originalname }      
      const productList = await knex('diy_product_list').where('diy_product_id', id)
      let products = JSON.parse(body.products);

      const removeProduct = productList.reduce((prev, curr) => {
        const check = products.some(i => i.diy_product_id === curr.id);
        if(!check) { prev.push(curr.id) }
        return prev;
      }, [])
      
      const newProduct = products.reduce((prev, product_id) => {
        const check = productList.some(item => item.id === product_id)
        if(!check) { prev.push({ product_id, diy_product_id: id }) }
        return prev;
      }, [])

      if(Array.isArray(newProduct) && newProduct.length !== 0) await tnx('diy_product_list').where('id', removeProduct)
      if(Array.isArray(newProduct) && newProduct.length !== 0) await tnx('diy_product_list').insert(newProduct)
      
      delete body.products;
      await tnx('diy_products').update(body)

      await tnx.commit();
      return resolve("DIY Product updated")
    } catch (error) {
      if(file){ removeFile(`DIY-products/${file.filename}`)}
      return reject(error)
    }
  })
}

exports.getDIYProductModel = () => {
  return new Promise(async(resolve, reject) => {
    try {
      let query = `
          SELECT a.*, b.name as category FROM diy_products as a
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

exports.getDIYProductByIdModel = (id) => {
  return new Promise(async(resolve, reject) => {
    try { 
      const [DIYProduct] = await knex('diy_products').where('id', id)
      const query = `
          SELECT a.*, b.url,  from diy_product_list AS a
          INNER JOIN product_images AS b ON a.product_id=b.product_id 
          WHERE diy_product_id=?
        `
      const { rows } = await knex.raw(query, [id])
      const productList = rows.reduce((prev, curr) => {
        const check = prev.some((item) => item.product_id === curr.product_id)
        if(!check) prev.push(curr)
        return prev;
      }, [])

      return resolve({ DIYProduct, productList })
    } catch (error) {
      console.log(error)
      return reject(error)
    }
  })
}

exports.deleteDIYProductModel = (id) => {
  return knex('diy_product').where('id', id).delete()
}