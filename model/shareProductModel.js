const knex = require("../db")
const { removeFile } = require("../libs/removeFile")

exports.addShareProductModel = async(data, files, user) => {
    const tnx = await knex.transaction();
    try {
      const obj = { ...data, user_id: user.id }
      const [product] =  await tnx('share_products').insert(obj).returning("*")
      
      let imageList = []
      if(files && Array.isArray(files) && files.length !== 0){
        const images = files.map((file) => {
          const url = `share-product/${file.filename}`
          const originalname = file.originalname;
          return { url, originalname, share_product_id: product.id }
        })
        imageList = await tnx('share_product_images').insert(images).returning("*")
      }

      await tnx.commit();
      return { product, images: imageList }
    } catch (error) {
      console.log(error)
      await tnx.rollback()
      if(files && Array.isArray(files) && files.length !== 0){
        files.forEach(({ filename }) => removeFile(`share-product/${filename}`))
      }
      return Promise.reject(error)
    }
}

exports.updateShareProductModel = async(data, files, id, user) => {
    const tnx = await knex.transaction();
    try {
      if(data.user_id !== user.id) throw "This is not your product show you cann't update this product"
      let [product] = await tnx('share_products').where('id', id).update(data).returning('*')
     
      let imageList = []
      if(files && Array.isArray(files) && files.length !== 0){
        const images = files.map((file) => {
          const url = `share-product/${file.filename}`
          const originalname = file.originalname;
          return { url, originalname, share_product_id: id }      
        })  
        imageList = await tnx('share_product_images').insert(images).returning('*')
      }

      await tnx.commit()
      return { product, images: imageList }
    } catch (error) {
      // console.log(error)
      await tnx.rollback();
      if(files && Array.isArray(files) && files.length !== 0){
        files.forEach(({ filename }) => removeFile(`share-product/${filename}`))
      }
      return Promise.reject(error)
    }
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

exports.getShareProductByTitleModel = (title) => {
  return new Promise(async(resolve, reject) => {
    try {
      title = title.replace(/-/g, ' ').toLowerCase();
      const query = `SELECT * FROM share_products WHERE LOWER(title)=?`
      const { rows } = await knex.raw(query, [title])
      if(rows.length === 0) return reject('product not found')
      const product = rows[0]
      const images = await knex('share_product_images').where("share_product_id", product.id)
      if(images.length === 0) { product.images = null }
      else { product.images = images }
      
      const [user] = await knex('users').where('id', product.user_id).select("id", "email", "firstname", "lastname", "phonenumber")
      if(user) { product.user = user }
      else { product.user = null }

      return resolve(product)
    } catch (error) {
      console.log(error)
      return reject(error)
    }
  })
}

exports.getShareProductByIdModel = (id, user) => {
  return knex('share_products').where('id', id).andWhere('user_id', user.id)
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