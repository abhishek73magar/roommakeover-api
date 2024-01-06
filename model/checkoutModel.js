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
      body.user_id = user.id
      await knex("checkout").insert(body);
      return resolve("Product added for checkout");
    } catch (error) {
      return reject(error);
    }
  });
};

exports.addMultipleProductAsCheckoutModel = (body, user) => {
  return new Promise(async(resolve, reject) => {
    const tnx = await knex.transaction();
    try {
      const checkoutProduct = await knex('checkout').where('user_id', user.id)
      const removeIds = []
      const updateProduct = []
      const changeAbleProduct = body.reduce((prev, item) => {
        const product = checkoutProduct.find((i) => i.product_id === item.product_id)
        // console.log(product)
        if(product){
          product.qty = item.qty + +product.qty
          updateProduct.push(product)
          // removeIds.push(product.id) 
        } else {
          item.id = uid(10)
          item.user_id = user.id;
          prev.push(item)
        }
        // console.log(item)
        return prev;
      }, [])

      if(removeIds.length > 0) await tnx('checkout').whereIn('id', removeIds).delete();
      if(updateProduct.length > 0){
        const updateStatement = updateProduct.map(obj => `WHEN '${obj.id}' THEN ?`).join(' ');
        const values = updateProduct.map(obj => obj.qty);
        const rawQuery = `UPDATE checkout SET qty = CASE id ${updateStatement} ELSE qty END`;
        await tnx.raw(rawQuery, values)

      }
      if(changeAbleProduct.length !== 0) await tnx("checkout").insert(changeAbleProduct);
      await tnx.commit();
      return resolve("Product added for checkout");
      
    } catch (error) {
      console.log(error)
      await tnx.rollback();
      return reject(error)
    }
  })
}

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
        .select("a.*", "b.pid", "b.title", "b.price");

      for (let i = 0; i < products.length; i++) {
        const product = products[i];
        const [image] = await knex("product_images").where("product_id", product.pid);
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
