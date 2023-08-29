const { uid } = require("uid");
const knex = require("../db");

exports.addWishlistModel = (body, user) => {
  return new Promise(async (resolve, reject) => {
    try {
      body.id = uid(10);
      body.user_id = user.id;
      await knex("wishlist").insert(body);
      return resolve("Product add to wishlist");
    } catch (error) {
      return reject(error);
    }
  });
};

exports.updateWishlistModel = (body, id) => {
  return knex("wishlist").where("id", id).update(body);
};

exports.getWishlistModel = (user) => {
  return new Promise(async (resolve, reject) => {
    try {
      const products = await knex("wishlist as a")
        .leftJoin("products_list as b", "a.product_id", "b.pid")
        .where("a.user_id", user.id)
        .select("a.*", "b.pid", "b.title", "b.price", "b.category");

      for (let i = 0; i < products.length; i++) {
        const product = products[i];
        const [image] = await knex("product_images").where(
          "product_id",
          product.pid
        );
        product.url = image.url;
      }

      return resolve(products);
    } catch (error) {
      console.log(error);
      return reject(error);
    }
  });
};

exports.getWishlistByIdModel = (id, user) => {
  return new Promise(async (resolve, reject) => {
    try {
      const product = await knex("wishlist as a")
        .leftJoin("products_list as b", "a.product_id", "b.pid")
        .where("a.user_id", user.id)
        .AndWhere("b.id", id)
        .select("a.*", "b.pid", "b.title", "b.price", "b.category");

      const [image] = await knex("product_images").where(
        "product_id",
        product.pid
      );
      product.imagesrc = image.url;

      return resolve(product);
    } catch (error) {
      return reject(error);
    }
  });
};

exports.removeWishListModel = (pid, user) => {
  return knex("wishlist")
    .where("product_id", pid)
    .andWhere("user_id", user.id)
    .delete();
};

exports.deleteWishlistModel = (id) => {
  return knex("wishlist").where("id", id).delete();
};
