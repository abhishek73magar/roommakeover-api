const { uid } = require("uid");
const knex = require("../db");

exports.addCheckoutModel = (body, user) => {
  return new Promise(async (resolve, reject) => {
    try {
      const [product] = await knex("checkout")
        .where("product_id", body.product_id)
        .andWhere("user_id", user.id);

      if (product) {
        const qty = parseInt(product.qty) + body.qty;
        // const price = body.price;
        await knex("checkout").where("id", product.id).update({ qty });
        return resolve("Product added for checkout");
      }

      body.id = uid(10);
      await knex("checkout").insert(body);
      return resolve("Product added for checkout");
    } catch (error) {
      return reject(error);
    }
  });
};

exports.updateCheckoutModel = (body, id) => {
  return new Promise(async (resolve, reject) => {
    try {
      await knex("checkout").where("id", id).update(body);
      return resolve("Checkout product updated");
    } catch (error) {
      return reject(error);
    }
  });
};

exports.getCheckoutModel = (user) => {
  return new Promise(async (resolve, reject) => {
    try {
      const products = await knex("checkout as a")
        .join("products as b", "a.product_id", "b.pid")
        .where("a.user_id", user.id)
        .select("a.*", "b.pid", "b.title", "b.price", "b.category");

      for (let i = 0; i < products.length; i++) {
        const product = products[i];
        const [image] = await knex("product_images").where(
          "product_id",
          product.pid
        );
        product.url = image.url;
        product.alt = image.originalname;
      }
      return resolve(products);
    } catch (error) {
      console.log(error);
      return reject(error);
    }
  });
};

exports.deleteCheckoutModel = (id) => {
  return knex("checkout").where("id", id).delete();
};

exports.removeCheckoutModel = (pid, user) => {
  return new Promise(async (resolve, reject) => {
    try {
      const select = knex("checkout")
        .where("product_id", pid)
        .andWhere("user_id", user.id);

      const [checkout] = await select;
      if (checkout.qty > 1) {
        const qty = Number(checkout.qty) - 1;
        await select.update({ qty });
        return resolve("Remove product 1 qty");
      }

      await select.delete();
      return resolve("Removed product");
    } catch (error) {
      return reject(error);
    }
  });
};
