const knex = require("../../db")
const { removeFile } = require("../../libs/removeFile")

exports.updateCustomizationModel = async(body, id) => {
  try {
    
    return "Update successfully"
  } catch (error) {
    return Promise.reject(error)
  }
}

exports.getCustomizationModel = async() => {
  try {
    const query = `
      SELECT cp.*, (
        SELECT url FROM customization_images ci WHERE ci.customization_id=cp.id LIMIT 1
      ) as url,
      (
        SELECT CONCAT(u.firstname, ' ', u.lastname) as fullname FROM users u WHERE u.id=cp.user_id LIMIT 1
      ) as fullname FROM customization_product cp
    `
    const { rows } = await knex.raw(query)
    return rows;

  } catch (error) {
    console.log(error)
    return Promise.reject(error)    
  }
}

exports.getCustomizationByIdModel = async(id) => {
  try {
    const [product] = await knex('customization_product').where('id', id)
    if(!product) throw "Product not found !"

    const [user] = await knex('users').where('id', product.user_id)
    if(!user) throw "User not found !"
    product.images = await knex('customization_images').where('customization_id', product.id)
    product.user = user

    return product;
  } catch (error) {
    console.log(error)
    return Promise.reject(error)
  }
}

exports.removeCustomizationModel = async(id) => {
  const tnx = await knex.transaction()
  try {
    const images = await knex('customization_images').where('id', id)
    await tnx('customization_product').where('id', id)
    images.forEach((i) => removeFile(i.url))

    await tnx.commit()
    return "Customization Product Removed !"
  } catch (error) {
    console.log(error)
    await tnx.rollback()
    return Promise.reject(error)
  }
}