const { uid } = require("uid");
const knex = require("../db");

exports.addOrderModel = (body, user) => {
  return new Promise(async (resolve, reject) => {
    try {
      const collection__id = uid(10);
      const obj = body.map((val) => {
        val.collection__id = collection__id;
        val.id = uid(10);
        val.user__id = user.id;
        return val;
      });
      // console.log(obj);
      return await knex.transaction((tnx) => {
        return knex("orders")
          .transacting(tnx)
          .insert(obj)
          .then(() => {
            return knex("checkout")
              .where("user__id", user.id)
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
      await knex("orders").where("collection__id", id).update(body);
      return resolve("Order Updated");
    } catch (error) {
      return reject(error);
    }
  });
};

exports.getOrdersModel = (user__id, role) => {
  return new Promise(async (resolve, reject) => {
    try {
      let orders = knex("orders as a").leftJoin(
        "billing__address as b",
        "a.address__id",
        "b.id"
      );
      if (role === "client") {
        orders = orders.where("a.user__id", user__id);
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
        const [image] = await knex("product__images").where(
          "product__id",
          order.product__id
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
          "billing__address",
          "orders.address__id",
          "=",
          "billing__address.id"
        )
        .where(`orders.${name}`, value);

      // data = await data;
      return resolve(data);
    } catch (error) {
      return reject(error);
    }
  });
};
