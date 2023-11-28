const { uid } = require("uid");
const knex = require("../db");

exports.addOrderModel = (body, user) => {
  return new Promise(async (resolve, reject) => {
    const tnx = await knex.transaction();
    try {
      const collection_id = uid(10);
      const obj = body.map((val) => {
        return {...val, collection_id, id: uid(10), user_id: user.id };
      });
      // console.log(obj);
      await tnx('orders').insert(obj)
      await tnx('checkout').where('user_id', user.id).delete();

      await tnx.commit();
      return resolve('Order send')
    } catch (error) {
      console.log(error);
      await tnx.rollback();
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

exports.getOrdersModel = (user) => {
  return new Promise(async (resolve, reject) => {
    try {
      let orders = await knex("orders").where("user_id", user.id).orderBy("date", "DESC");

      for (let i = 0; i < orders.length; i++) {
        const order = orders[i];
        const [image] = await knex("product_images").where("product_id",order.product_id);
        order.url = image.url;
        order.alt = image.originalname;
      }

      const newOrders = orders.reduce((prev, curr) => {
        const orderCollection = prev.find((item) => item.collection_id === curr.collection_id);
        if(orderCollection) { orderCollection.data.push(curr) }
        else { prev.push({ collection_id: curr.collection_id, datetime: curr.date, data: [ curr ]}) }
        return prev;
      }, [])
      return resolve(newOrders);
    } catch (error) {
      console.log(error);
      return reject(error);
    }
  });
};

exports.getOrderByIdModel = (collection_id, user) => {
  return new Promise(async (resolve, reject) => {
    try {
      let orders = await knex("orders").where({ user_id: user.id, collection_id }).orderBy("date", "DESC");

      for (let i = 0; i < orders.length; i++) {
        const order = orders[i];
        const [image] = await knex("product_images").where("product_id",order.product_id);
        order.url = image.url;
        order.alt = image.originalname;
      }

      const newOrders = orders.reduce((prev, curr) => {
        const orderCollection = prev.find((item) => item.collection_id === curr.collection_id);
        if(orderCollection) { orderCollection.data.push(curr) }
        else { prev.push({ collection_id: curr.collection_id, datetime: curr.date, data: [ curr ]}) }
        return prev;
      }, [])
      
      if(newOrders.length === 0) return reject("Order not found !")
      return resolve(newOrders[0]);
    } catch (error) {
      return reject(error);
    }
  });
};
