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
      tnx.commit();

    } catch (error) {
      console.log(error)
      tnx.rollback();
      if (files) {
        files.forEach(({ filename }) => {
          const path = `product/${filename}`;
          removeFile(path);
        });
      }
      return reject(error)
    }finally{
      return resolve("product added")
    }
  })
}

exports.updateProductForAdminModel = (body, files, pid) => {
  return new Promise(async(resolve, reject) => {
    const tnx = await knex.transaction();
    try {
      if (files && Array.isArray(files) && files.length !== 0) {
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
      return resolve("Product updated")
    } catch (error) {
      return reject(error)
    }
  })
}

exports.getProductForAdminModel = (params) => {
  return new Promise(async(resolve, reject) => {
    try {
      const result = { data: [], pagination: 1 };
      let products = knex('products').orderBy("create_date", 'desc')

      if (params.hasOwnProperty("total")) {
        // console.log(params);
        let total = params.total;
        let offset = 0;
        if (params.pagenumber) {
          offset = params.pagenumber * total - total;
        }
        const allData = await products;
        result["pagination"] = Math.ceil(allData.length / total);

        products = products.limit(total).offset(offset);
      }

      products = await products;

      for(let i = 0; i < products.length; i++){
        const product = products[i]
        const [image] = await knex('product_images').where('product_id', product.pid)
        product.url = image.url;
        product.originalname = image.originalname;
      }

      if(!params.hasOwnProperty('total')) { return resolve(products) }

      result["data"] = products
      return resolve(result)
    } catch (error) {
      console.log(error)
      return reject(error)
    }
  })
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
