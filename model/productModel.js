const { uid } = require("uid");
const knex = require("../db");
const { removeFile } = require("../libs/removeFile");
const { countRating } = require("../libs/countRating");

exports.addProductModel = (body, files) => {
  const pid = uid(10);

  return new Promise(async (resolve, reject) => {
    try {
      if (files) {
        const fileList = files.map((file) => {
          const name = file.filename;
          const url = "products/" + name;
          const originalname = file.originalname;
          return { name, url, originalname, product_id: pid };
        });

        return await knex
          .transaction((tnx) => {
            const obj = { pid, ...body };
            return knex("product_images")
              .transacting(tnx)
              .insert(fileList)
              .then(() => {
                return knex("products")
                  .insert(obj)
                  .then(() => {
                    tnx.commit();
                    return resolve("Product added");
                  })
                  .catch(tnx.rollback);
              })
              .catch(tnx.rollback);
          })
          .catch((err) => reject(err));
      }

      const obj = { pid, ...body };
      await knex("products").insert(obj);
      return resolve("Product added");
    } catch (error) {
      if (files) {
        files.forEach(({ filename }) => {
          const path = `product/${filename}`;
          removeFile(path);
        });
      }
      return reject(error);
    }
  });
};

exports.getProductModel = (params) => {
  return new Promise(async (resolve, reject) => {
    try {

      let total_page = 1
      let limit = 10;
      let values = []
      let query = `
        SELECT p.*, 
        (
          SELECT json_build_object(
            'url', pi.url,
            'originalname', pi.originalname
          ) FROM product_images pi WHERE pi.product_id=p.pid LIMIT 1
        ) as image
        FROM products p
        WHERE p.status='1'
        ORDER BY p.create_date ASC
      `

      
      if(params.hasOwnProperty('limit')) limit = params.limit
      if(params.hasOwnProperty('page')){
        let [totalProduct] = await knex('products').where("status", '1').count("title")
        totalProduct = totalProduct ? totalProduct.count : 1
        total_page = Math.ceil(totalProduct / limit)

        let { page } = params;
        let offset = (page * limit) - limit;
        query += ` LIMIT ? OFFSET ? `
        values.push(limit, offset)    
      }

      const { rows: data } = await knex.raw(query, values)
      return resolve({ total_page, data });
    } catch (error) {
      console.log(error)
      return reject(error);
    }
  });
};

exports.getProductOtherInfoModel = (query) => {
  return new Promise(async(resolve, reject) => {
    // status = [total page number, title]
    try {
      if(query.status === 'count' && query.hasOwnProperty('no_of_product')) {
         const [products] = await knex('products').where('status', '1').count()
         const total_page = Math.ceil(products.count / query.no_of_product)
         return resolve({ total_page })        
      }

      if(query.status === 'title'){
        const products = await knex('products').where('status', '1').select("title")
        return resolve(products)
      }

      return resolve(null)
    } catch (error) {
      console.log(error)
      return reject(error)
    }
  })
}

exports.getProductByTablenameModel = (params, role) => {
  return new Promise(async (resolve, reject) => {
    try {
      let { colname, value } = params;
      value = value.replace(/-/g, " ");

      let products = knex("products").where(colname, value);
      if (role === "client")
        products = products.andWhere("status", "1");

      products = await products;
      if (!products || products.length === 0) return reject("Data not found");

      for (let i = 0; i < products.length; i++) {
        const product = products[i];
        let images = await knex("product_images").where("product_id", product.pid);
        if (images) {
          product.images = images;
          product.url = images[0].url;
          product.alt = images[0].originalname;
        }
        product.rating = await countRating(product.pid);
      }
      return resolve(products);
    } catch (error) {
      console.log(error);
      return reject(error);
    }
  });
};

exports.getproductByTitleModel = async(title) => {
    try {
      if(!title || title === '') throw ('Params not found !')
      title = title.replace(/-/g, ' ').toLowerCase();

      const query = `
        SELECT p.*, 
        (
          SELECT json_agg(json_build_object(
            'url', pi.url,
            'originalname', pi.originalname
          )) FROM product_images pi WHERE pi.product_id=p.pid
        ) as images,
        CASE
          WHEN (
            SELECT COUNT(*) FROM reviews r WHERE r.product_id=p.pid
          ) > 0
          THEN (
            SELECT 
            SUM(r.rating)::NUMERIC/COUNT(*)
            FROM reviews r WHERE r.product_id=p.pid
          ) ELSE NULL
          END as rating        
        FROM products p WHERE LOWER(p.title)=?
      `
      const { rows: [product] } = await knex.raw(query, [title]) 
      if(!product) throw ('Unknow Product')
      return product
    } catch (error) {
      console.log(error)
      return Promise.reject(error)
    }
}

exports.getProductByPIDModel = (pid) => {
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

exports.updateProductModel = (body, files, pid) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (files && Array.isArray(files) && files.length !== 0) {
        const fileList = files.map((file) => {
          const name = file.filename;
          const url = "products/" + name;
          const originalname = file.originalname;
          return { name, url, originalname, product_id: pid };
        });

        await knex("product_images").insert(fileList);
      }

      const obj = { ...body, update_date: new Date().toISOString() };

      await knex("products").where("pid", pid).update(obj);
      return resolve("Update successfully");
    } catch (error) {
      console.log(error);
      if (files) {
        files.forEach(({ filename }) => {
          const path = `product/${filename}`;
          removeFile(path);
        });
      }
      return reject(error);
    }
  });
};

exports.deleteProductModel = (pid) => {
  return new Promise(async (resolve, reject) => {
    try {
      const images = await knex("product_images").where("product_id", pid);

      await knex("product_images").where("product_id", pid).delete();
      images.forEach((image) => { removeFile(image.url) });
      await knex("products").where("product_id", pid).delete();
      
      return resolve("Product Removed");
    } catch (error) {
      return reject(error);
    }
  });
};

exports.productImageModel = (pid) => {
  return new Promise(async (resolve, reject) => {
    try {
      let images = knex("product_images as a").leftJoin("products as b", "a.product_id", "b.pid");
      if (pid !== "all") images = images.where("product_id", pid);

      images = await images.select("a.*", "b.title");
      return resolve(images);
    } catch (error) {
      return reject(error);
    }
  });
};

exports.deleteProdcutImageModel = (id) => {
  return new Promise(async(resolve, reject) => {
    try {
      const [image] = await knex('product_images').where('id', id)
      await knex('product_images').where('id', id).delete();
      removeFile(image.url)
      return resolve("Remove image")
    } catch (error) {
      return reject(error)
    }
  })
}

exports.totalProductsModel = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const [count] = await knex("products").count({ count: "*" });
      return resolve(count);
    } catch (error) {
      return reject(error);
    }
  });
};

exports.getProductByCategoryNameModel = async(name) => {
    try {
      name = name.replace(/-/g, ' ').toLowerCase();
      let query = `SELECT 
      p.*, 
      (
        SELECT json_build_object(
          'url', pi.url,
          'originalname', pi.originalname
        ) FROM product_images pi WHERE pi.product_id=p.pid LIMIT 1
      ) as image, 
      c.name as category_name 
      FROM categorys as c 
      INNER JOIN products as p ON c.id=p.category_id 
      WHERE LOWER(c.name)=?`

      const { rows: products } = await knex.raw(query, [name])
      return products

    } catch (error) {
      console.log(error)
      return Promise.reject(error)
    }
}

exports.topSellingProductModel = async(total=7) => {
    try {
      const query = `
        SELECT 
          COUNT(product_id) as total_product, product_id,
          p.id, p.pid, p.title, p.price, p.on_sale, p.category_id,
          (SELECT json_build_object(
             'url', pi.url,
             'originalname', pi.originalname
           ) FROM product_images pi WHERE pi.product_id=p.pid LIMIT 1
         ) as image
        FROM orders o 
        LEFT JOIN products p ON p.pid=o.product_id
        WHERE o.status=1 OR o.status=2 OR o.status=4 
        GROUP BY o.product_id, p.id ORDER BY total_product DESC LIMIT ?
      `

      const { rows: products } = await knex.raw(query, [total])
      return products
    } catch (error) {
      console.log(error)
      return Promise.reject(error.message ?? error);
    }
};

exports.getOnSellProductModel = async() => {
    try {
      const query = `
        SELECT p.*, 
        (
          SELECT json_build_object(
            'url', pi.url,
            'originalname', pi.originalname
          ) FROM product_images pi WHERE pi.product_id=p.pid LIMIT 1
        ) as image       
        FROM products p WHERE status='1' AND on_sale='1'
      `
      const { rows: products } = await knex.raw(query);

         
        // product.rating = await countRating(product.pid);
      return products;
    } catch (error) {
      console.log(error);
      return Promise.reject(error);
    }
};

exports.getSearchProductModel = async(title, role) => {
    try {
      const query = `
        SELECT p.*, 
        (
          SELECT json_build_object(
            'url', pi.url,
            'originalname', pi.originalname
          ) FROM product_images pi WHERE pi.product_id=p.pid LIMIT 1
        ) as image       
        FROM products p WHERE p.status='1' AND LOWER(title) LIKE LOWER('%${title}%')
      `
      const { rows: products } = await knex.raw(query)
      return products
    } catch (error) {
      console.log(error)
      return Promise.reject(error);
    }
};
