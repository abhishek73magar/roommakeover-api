const knex = require("../db")

exports.getDiyProductModel = () => {
  return knex("diy_products").where({ status: "1" })
}

exports.getDiyProductAllTitleModel = () => {
  return knex('diy_products').where({ status: "1" }).select("title")
}

exports.getDiyProductByTitleModel = async(title) => {
  try {
    title = title.toLowerCase().replace(/-/g, " ")
    
    let query = `SELECT * FROM diy_products WHERE LOWER(title)=?`
    const { rows } = await knex.raw(query, [title])
    if(rows.length === 0) throw "DIY Product not found !"
    const diyProduct = rows[0]
    
    const products = await knex('diy_product_list as a').join('products as b', 'a.product_id', '=', 'b.pid').where('a.diy_id', diyProduct.id)
    for(let i = 0; i < products.length; i++){
      const product = products[i]
      const [image] = await knex('product_images').where('product_id', product.pid)
      if(image){
        product.url = image.url
        product.alt = image.alt
      }
    }

    

    return {...diyProduct, products };
  } catch (error) {
    return error;
  }
}

