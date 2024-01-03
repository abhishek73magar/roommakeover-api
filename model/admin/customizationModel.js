const knex = require("../../db")
const { removeFile } = require("../../libs/removeFile")

exports.updateCustomizationModel = async(body, id) => {
  try {
    
    return "Update successfully"
  } catch (error) {
    return Promise.reject(error)
  }
}

exports.getCustomizationModel = () => {
  return knex('customization_products')
}

exports.getCustomizationByIdModel = async(id) => {
  try {
    const [product] = await knex('customization_products').where('id', id)
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
    await tnx('customization_products').where('id', id)
    images.forEach((i) => removeFile(i.url))

    await tnx.commit()
    return "Customization Product Removed !"
  } catch (error) {
    console.log(error)
    await tnx.rollback()
    return Promise.reject(error)
  }
}