const knex = require("../db")
const { removeFile } = require("../libs/removeFile")

exports.addShareProductModel = (data, files, user) => {
  return new Promise(async(resolve, reject) => {
    const tnx = await knex.transaction();
    try {

      console.log(data, files)
      
      const obj = {...data, user_id: user.id }
      const [product] =  await tnx('share-products').insert(obj).returning("*")
      
      if(files && Array.isArray(files) && files.length !== 0){
        const images = files.map((file) => {
          const url = `share-product/${file.filename}`
          const originalname = file.originalname;
          return { url, originalname, share_product_id: product.id }
        })
        await tnx('share-product-images').insert(images)
      }

      await tnx.commit();
      return resolve(obj)
    } catch (error) {
      await tnx.rollback()
      if(files && Array.isArray(files) && files.length !== 0){
        files.forEach(({ filename }) => removeFile(`share-product/${filename}`))
      }
      return reject(error)
    }
  })
}

exports.updateShareProductModel = (data, files, id, user) => {
  return new Promise(async(resolve, reject) => {
    const tnx = await knex.transaction();
    try {
      if(data.user_id !== user.id) return reject("This is not your product show you cann't update this product")
      await tnx('share-products').where('id', id).update(data)
     
      if(files && Array.isArray(files) && files.length !== 0){
        const images = files.map((file) => {
          const url = `share-product/${file.filename}`
          const originalname = file.originalname;
          return { url, originalname, share_product_id: product.id }
        })
        await tnx('share-product-images').insert(images)
      }

      await tnx.commit()
      return resolve("Your product is updated")
    } catch (error) {
      await tnx.rollback();
      if(files && Array.isArray(files) && files.length !== 0){
        files.forEach(({ filename }) => removeFile(`share-product/${filename}`))
      }
      return reject(error)
    }
  })
}

exports.getShareProductForUserModel = (user) => {
  return knex('share-products').where('user_id', user.id)
}

// 0 draft, 1 share, 2 onsale
exports.getShareProductModel = () => {
  return knex('share-products').where('status', '1').orWhere('status', '2')
}

exports.getShareProductByIdModel = (id, user) => {
  return knex('share-products').where('id', id).andWhere('user_id', user.id)
}

exports.getShareProductByTitleModel = (title) => {
  title = title.replace(/-/g, ' ')
  return knex('share-products').whereILike('title', `%${title}%`)
}

exports.deleteShareProductModel = (id, user) => {
  return new Promise(async(resolve, reject) => {
    const tnx = await knex.transaction();
    try {
      await tnx('share-products').where('id', id).andWhere('user_id', user.id).delete()
      const imageList = await tnx('share-product-images').where('share_product_id', id)
      imageList.forEach((item) => {
        removeFile(item.url)
      })
      await tnx.commit();
      return resolve("Share product removed")
    } catch (error) {
      return reject(error)
    }
  })
  
}