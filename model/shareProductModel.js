const knex = require("../db")
const { removeFile } = require("../libs/removeFile")

exports.addShareProductModel = (data, files, user) => {
  return new Promise(async(resolve, reject) => {
    const tnx = await knex.transaction();
    try {
      const obj = {...data, user_id: user.id }
      const [product] =  await tnx('share_products').insert(obj).returning("*")
      
      if(files && Array.isArray(files) && files.length !== 0){
        const images = files.map((file) => {
          const url = `share-product/${file.filename}`
          const originalname = file.originalname;
          return { url, originalname, share_product_id: product.id }
        })
        await tnx('share_product_images').insert(images)
      }

      await tnx.commit();
      return resolve(obj)
    } catch (error) {
      console.log(error)
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
      await tnx('share_products').where('id', id).update(data)
     
      if(files && Array.isArray(files) && files.length !== 0){
        const images = files.map((file) => {
          const url = `share-product/${file.filename}`
          const originalname = file.originalname;
          return { url, originalname, share_product_id: id }      
        })  
        await tnx('share_product_images').insert(images)
      }

      await tnx.commit()
      return resolve("Your product is updated")
    } catch (error) {
      console.log(error)
      await tnx.rollback();
      if(files && Array.isArray(files) && files.length !== 0){
        files.forEach(({ filename }) => removeFile(`share-product/${filename}`))
      }
      return reject(error)
    }
  })
}

exports.getShareProductForUserModel = (user) => {
  return new Promise(async(resolve, reject) => {
    try {
      const products = await knex('share_products').where('user_id', user.id)
      const productLength = products.length;
      for(let i = 0; i < productLength; i++){
        const product = products[i];
        const [image] = await knex('share_product_images').where('share_product_id', product.id).select("originalname", "url")
        if(image) {
          product.image = image;
        } else { product.image = null }
      }

      return resolve(products)
    } catch (error) {
      console.log(error)
      return reject(error)
    }
  })
}

// 0 draft, 1 share, 2 onsale
exports.getShareProductModel = () => {
  return new Promise(async(resolve, reject) => {
    try {
      const products = await knex('share_products').where('status', '1').orWhere('status', '2')
      
      for(let i = 0; i < products.length; i++){
        const product = products[i]
        const images = await knex("share_product_images").where("share_product_id", product.id)
        if(images.length === 0) { product.image = null }
        else { product.image = images[0] }
      }

      return resolve(products)
    } catch (error) {
      console.log(error)
      return reject(error)
    }
    
  })
}

exports.getShareProductByIdModel = (id, user) => {
  return knex('share_products').where('id', id).andWhere('user_id', user.id)
}

exports.getShareProductByTitleModel = (title) => {
  title = title.replace(/-/g, ' ')
  return knex('share_products').whereILike('title', `%${title}%`)
}

exports.getShareProductImagesModel = (pid) => {
  return knex('share_product_images').where("share_product_id", pid)
}

exports.deleteShareProductImageByIdModel = (id) => {
  return new Promise(async(resolve, reject) => {
    const tnx = await knex.transaction();
    try {
      const images = await tnx('share_product_images').where('id', id).delete().returning('*');

      images.forEach((image) => removeFile(image.url))
      await tnx.commit();
      return resolve("share product image removed")
    } catch (error) {
      await tnx.rollback();
      return reject(error)
    }
  })
}

exports.deleteShareProductModel = (id, user) => {
  return new Promise(async(resolve, reject) => {
    const tnx = await knex.transaction();
    try {
      const imageList = await tnx('share_product_images').where('share_product_id', id)
      await tnx('share_products').where('id', id).andWhere('user_id', user.id).delete()
      imageList.forEach((item) => {
        removeFile(item.url)
      })
      await tnx.commit();
      return resolve("Share product removed")
    } catch (error) {
      console.log(error)
      return reject(error)
    }
  })
  
}