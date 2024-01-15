const { uid } = require("uid");
const knex = require("../../db");
const { removeFile } = require("../../libs/removeFile");

exports.addProductForAdminModel = (body, files) => {
  return new Promise (async(resolve, reject) => {
    const pid = uid(10);
    const tnx = await knex.transaction();
    try {
      await tnx('products').insert({pid, ...body})
      if (files && Array.isArray(files) && files.length !== 0) {
        const fileList = files.map((file) => {
          const name = file.filename;
          const url = "products/" + name;
          const originalname = file.originalname;
          return { name, url, originalname, product_id: pid };
        });
        await tnx("product_images").insert(fileList)
      }
      await tnx.commit();
      return resolve('product added')
    } catch (error) {
      console.log(error)
      await tnx.rollback();
      if (Array.isArray(files)) {files.forEach(({ filename }) => removeFile(`product/${filename}`))}
      return reject(error)
    }
  })
}

exports.updateProductForAdminModel = async(body, files, pid) => {
    const tnx = await knex.transaction();
    try {
      Object.keys(body).forEach((keys) => {
        if(body[keys] === 'null') body[keys] = null
        if(keys === 'colors') body[keys] = JSON.parse(body[keys])
      })

      if (Array.isArray(files) && files.length > 0) {
        const fileList = files.map((file) => {
          const name = file.filename;
          const url = "products/" + name;
          const originalname = file.originalname;
          return { name, url, originalname, product_id: pid };
        });

        await tnx("product_images").insert(fileList);
      }

      const obj = { ...body, update_date: new Date().toISOString() };
      await tnx("products").where("pid", pid).update(obj);
      await tnx.commit(); 
      return "Product updated"
    } catch (error) {
      console.log(error)
      await tnx.rollback()
      if (Array.isArray(files)) {files.forEach(({ filename }) => removeFile(`product/${filename}`))}
      return Promise.reject(error)
    }
}

exports.getProductForAdminModel = async(params) => {
    try {
      let pagination = 1;
      let limit = 40;
      // let products = knex('products').orderBy("create_date", 'desc')
      const values = []

      let query = `
        SELECT p.*,
        (
          SELECT pi.url FROM product_images pi WHERE pi.product_id=p.pid LIMIT 1
        ) AS url
        FROM products p
      `

      if(params.hasOwnProperty('limit')) limit = params.limit || 10
      query += ` ORDER BY p.create_date DESC `

      if(params.hasOwnProperty('page')){
        let [totalProduct] = await knex('products').count("title")
        totalProduct = totalProduct ? totalProduct.count : 1
        pagination = Math.ceil(totalProduct / limit)

        let { page } = params;
        let offset = (page * limit) - limit;
        query += ` LIMIT ? OFFSET ? `
        values.push(limit, offset)          
      }

      const { rows: data } = await knex.raw(query, values)
      return { data, pagination }

    } catch (error) {
      console.log(error)
      return Promise.reject(error)
    }
}

exports.getProductByPIDForAdminModel = (pid) => {
  return new Promise(async(resolve, reject) => {
    try {
      const [product] = await knex('products').where('pid', pid)
      // const images = await knex('product_images').where('product_id', pid)
      if(!product) return reject("Product not found !")
      return resolve(product)
    } catch (error) { 
      console.log(error)
      return reject(error)
    }
  })
}

exports.getProductSingleImageModel = (body) => {
  return new Promise(async(resolve, reject) => {
    try {
      const images = await knex('product_images').whereIn('product_id', body.id)
      return resolve(images.reduce((prev, curr) => {
        const check = prev.some((item) => item.product_id === curr.product_id)
        if(!check) prev.push(curr)
        return prev;
      }, []))
    } catch (error) {
      return reject(error)
    }
  })
}

exports.deleteProductForAdminModel = (pid) => {
  return new Promise(async (resolve, reject) => {
    const tnx = await knex.transaction();
    try {
      const images = await knex("product_images").where("product_id", pid);

      // await tnx("product_images").where("product_id", pid).delete();
      console.log(pid)
      await tnx("products").where("pid", pid).delete();

      images.forEach((image) => { removeFile(image.url) });
      await tnx.commit();
      return resolve("Product Removed");
    } catch (error) {
      await tnx.rollback();
      console.log(error)
      return reject(error);
    }
  });
};
