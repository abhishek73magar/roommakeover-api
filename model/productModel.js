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
          const url = "product/" + name;
          const originalname = file.originalname;
          return { name, url, originalname, product__id: pid };
        });

        return await knex
          .transaction((tnx) => {
            const obj = { pid, ...body };
            return knex("product__images")
              .transacting(tnx)
              .insert(fileList)
              .then(() => {
                return knex("products__list")
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
      await knex("products__list").insert(obj);
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

exports.getProductModel = (params, role) => {
  return new Promise(async (resolve, reject) => {
    try {
      const result = { newData: [], paginationNum: 1 };
      let products;
      if (role === "client") {
        products = knex("products__list").where("status", "published");
      } else {
        products = knex("products__list");
      }

      if (params.hasOwnProperty("noofproduct")) {
        // console.log(params);
        let noofproduct = params.noofproduct;
        let offset = 0;
        if (params.pagenumber) {
          offset = params.pagenumber * noofproduct - noofproduct;
        }
        const allData = await products;
        result["paginationNum"] = Math.ceil(allData.length / noofproduct);

        products = products.limit(noofproduct).offset(offset);
      }

      products = await products;
      for (let i = 0; i < products.length; i++) {
        const product = products[i];
        let [image] = await knex("product__images").where(
          "product__id",
          product.pid
        );

        product.url = image.url;
        product.alt = image.originalname;
      }
      result["newData"] = products;
      return resolve(result);
    } catch (error) {
      return reject(error);
    }
  });
};

exports.getProductByTablenameModel = (params, role) => {
  return new Promise(async (resolve, reject) => {
    try {
      let { colname, value } = params;
      value = value.replace(/-/g, " ");

      let products = knex("products__list").where(colname, value);
      if (role === "client")
        products = products.andWhere("status", "published");

      products = await products;
      if (!products || products.length === 0) return reject("Data not found");

      for (let i = 0; i < products.length; i++) {
        const product = products[i];
        let images = await knex("product__images").where(
          "product__id",
          product.pid
        );
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

exports.updateProductModel = (body, files, pid) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (files) {
        const fileList = files.map((file) => {
          const name = file.filename;
          const url = "product/" + name;
          const originalname = file.originalname;
          return { name, url, originalname, product__id: pid };
        });

        await knex("product__images").insert(fileList);
      }

      const obj = { ...body, update__date: new Date() };
      await knex("products__list").where("pid", pid).update(obj);
      return resolve("Update successfully");
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

exports.deleteProductModel = (pid) => {
  return new Promise(async (resolve, reject) => {
    try {
      const images = await knex("product__images").where("product__id", pid);

      await knex("product__images").where("product__id", pid).delete();
      images.forEach((image) => {
        removeFile(image.url);
      });

      await knex("products__list").where("product__id", pid).delete();
      return resolve("Product Removed");
    } catch (error) {
      return reject(error);
    }
  });
};

exports.productImageModel = (pid) => {
  return new Promise(async (resolve, reject) => {
    try {
      let images = knex("product__images as a").leftJoin(
        "products__list as b",
        "a.product__id",
        "b.pid"
      );
      if (pid !== "all") images = images.where("product__id", pid);

      images = await images.select("a.*", "b.title");
      return resolve(images);
    } catch (error) {
      return reject(error);
    }
  });
};

exports.totalProductsModel = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const [count] = await knex("products__list").count({ count: "*" });
      return resolve(count);
    } catch (error) {
      return reject(error);
    }
  });
};

exports.topSellingProductModel = (total = 7) => {
  return new Promise(async (resolve, reject) => {
    try {
      const orderList = await knex("orders")
        .where("status", "completed")
        .orWhere("status", "processing")
        .orWhere("status", "shipping");

      const uniqueOrder = orderList.reduce((prev, curr) => {
        const pid = curr.product__id;
        if (prev.hasOwnProperty(pid)) {
          prev[pid] += parseInt(curr.qty);
        } else {
          prev[pid] = parseInt(curr.qty);
        }
        return prev;
      }, {});

      const sortData = Object.keys(uniqueOrder)
        .map((key) => {
          return { pid: key, count: uniqueOrder[key] };
        })
        .sort((a, b) => b - a)
        .slice(0, total)
        .map(({ pid }) => pid);

      let products = await knex("products__list")
        .whereIn("pid", sortData)
        .andWhere("status", "published")
        .select("id", "pid", "title", "price", "on__sale", "category");
      for (let i = 0; i < products.length; i++) {
        const product = products[i];
        const [image] = await knex("product__images").where(
          "product__id",
          product.pid
        );
        product.url = image.url;
        product.alt = image.originalname;
      }

      return resolve(products);
    } catch (error) {
      return reject(error);
    }
  });
};

exports.getOnSellProductModel = (role) => {
  return new Promise(async (resolve, reject) => {
    try {
      const products = await knex("products__list")
        .where("status", "published")
        .andWhere("on__sale", "1");

      for (let i = 0; i < products.length; i++) {
        const product = products[i];
        const [image] = await knex("product__images").where(
          "product__id",
          product.pid
        );
        product.url = image.url;
        product.alt = image.originalname;

        product.rating = await countRating(product.pid);
      }

      return resolve(products);
    } catch (error) {
      console.log(error);
      return reject(error);
    }
  });
};

exports.getSearchProductModel = (title, role) => {
  return new Promise(async (resolve, reject) => {
    try {
      let products;
      if (role === "client") {
        products = knex("products__list").where("status", "published");
      } else {
        products = knex("products__list");
      }

      products = await products.whereILike("title", `%${title}%`);
      for (let i = 0; i < products.length; i++) {
        const product = products[i];
        let [image] = await knex("product__images").where(
          "product__id",
          product.pid
        );

        product.url = image.url;
        product.alt = image.originalname;
      }

      return resolve(products);
    } catch (error) {
      // console.log(error);
      return reject(error);
    }
  });
};
