const { uid } = require("uid");
const knex = require("../db");

exports.addOrderModel = (body, user) => {
  return new Promise(async (resolve, reject) => {
    try {
      const collection_id = uid(10);
      const obj = body.map((val) => {
        val.collection_id = collection_id;
        val.id = uid(10);
        val.user_id = user.id;
        return val;
      });
      // console.log(obj);
      return await knex.transaction((tnx) => {
        return knex("orders")
          .transacting(tnx)
          .insert(obj)
          .then(() => {
            return knex("checkout")
              .where("user_id", user.id)
              .delete()
              .then(tnx.commit)
              .then(() => resolve("Order send"))
              .catch(tnx.rollback)
              .catch((err) => reject(err));
          })
          .catch((err) => reject(err));
      });
    } catch (error) {
      console.log(error);
      return reject(error);
    }
  });
};

exports.updateOrderModel = (body, id) => {
  return new Promise(async (resolve, reject) => {
    try {
      await knex("orders").where("collection_id", id).update(body);
      return resolve("Order Updated");
    } catch (error) {
      return reject(error);
    }
  });
};

exports.getOrdersModel = (user_id, role) => {
  return new Promise(async (resolve, reject) => {
    try {
      let orders = knex("orders as a").leftJoin(
        "billing_address as b",
        "a.address_id",
        "b.id"
      );
      if (role === "client") {
        orders = orders.where("a.user_id", user_id);
      }

      orders = await orders
        .select(
          "a.*",
          "b.fullname",
          "b.region",
          "b.phonenumber",
          "b.city",
          "b.area",
          "b.colony",
          "b.address",
          "b.deliveryat"
        )
        .orderBy("date", "DESC");
      for (let i = 0; i < orders.length; i++) {
        const order = orders[i];
        const [image] = await knex("product_images").where(
          "product_id",
          order.product_id
        );
        order.url = image.url;
        order.alt = image.originalname;
      }

      return resolve(orders);
    } catch (error) {
      console.log(error);
      return reject(error);
    }
  });
};

exports.getOrderByIdModel = (name, value) => {
  return new Promise(async (resolve, reject) => {
    try {
      let data = await knex("orders")
        .join(
          "billing_address",
          "orders.address_id",
          "=",
          "billing_address.id"
        )
        .where(`orders.${name}`, value);

      // data = await data;
      return resolve(data);
    } catch (error) {
      return reject(error);
    }
  });
};
