const knex = require("../db")
const { removeFile } = require("../libs/removeFile")

exports.addCustomizationModel = async(body, files) => {
  const tnx = await knex.transaction()  
  try {
      const [product] = await tnx('customization_product').insert(body).returning('*')
      if(Array.isArray(files) && files.length > 0) {
        const images = files.map((item) => {
          const originalname = item.originalname;
          const url = `customization-product/${item.filename}`
          return { customization_id: product.id, url, originalname }
        })
        await tnx('customization_images').insert(images)
      }
      
      await tnx.commit()
      return "Add successfully"
    } catch (error) {
      await tnx.rollback()
      if(Array.isArray(files) && files.length > 0){
        files.forEach(item => removeFile(`customization-product/${item.filename}`))
      }
      console.log(error)
      return Promise.reject(error)
    }
}

exports.getCustomizationProductModel = (user) => {
  return knex('customization_product').where('user_id', user.id)
}

